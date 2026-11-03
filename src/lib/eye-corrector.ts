/**
 * EyeContactCorrector — real-time gaze redirection engine (production path).
 *
 * Pipeline, 100% client-side:
 *   <video> frame → MediaPipe FaceLandmarker (GPU delegate, iris landmarks)
 *                → per-eye gaze vector (iris offset vs. eye corners + head yaw)
 *                → WebGL2 fragment shader displaces each eye region so the
 *                  pupils are re-centered onto the camera lens — regardless of
 *                  where the user is actually looking (script, off-camera…).
 *
 * The warp is a feathered radial displacement around each eye: pixels sample
 * from a position shifted by the measured gaze offset, with smooth falloff so
 * surrounding skin stays untouched. Values are temporally smoothed (~60fps
 * render, ~30Hz inference) to eliminate jitter between detections.
 *
 * Fallbacks:
 *   - No WebGL2 → Canvas 2D compositing (raw passthrough; correction needs GL).
 *   - Model unavailable → raw feed shown, error surfaced through status.
 */

import type { FaceLandmarker } from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export interface CorrectorStatus {
  /** Engine fully initialized and rendering corrected frames. */
  ready: boolean;
  loading: boolean;
  error: string | null;
  /** True while a face lock is active and warping is being applied. */
  tracking: boolean;
}

// ---- shaders --------------------------------------------------------------

const VERT = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // Fullscreen triangle without vertex buffers.
  vec2 pos = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  vUv = pos * 0.5 + 0.5;
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTex;
uniform vec2 uAspect;        // canvasW / canvasH — keeps warps circular on screen
uniform vec3 uLeft[3];       // [center.xy, shift.xy (+amount in .y? no), radii.xy]
uniform vec3 uRight[3];      // layout: e0=center.xy|0, e1=shift.xy*amount|amount, e2=radius.xy|0

vec2 warpEye(vec3 e0, vec3 e1, vec3 e2, vec2 uv) {
  float amount = e1.z;
  if (amount < 0.01) return uv;
  vec2 center = e0.xy;
  vec2 shift = e1.xy;
  vec2 r = max(e2.xy * uAspect, vec2(1e-5));
  vec2 d = (uv - center) * uAspect;
  float dist = length(d / r);
  if (dist >= 1.8) return uv;
  float fall = 1.0 - smoothstep(0.5, 1.5, dist);
  return uv - shift * fall;
}

void main() {
  vec2 uv = clamp(vUv, vec2(0.0), vec2(1.0));
  uv = warpEye(uLeft[0], uLeft[1], uLeft[2], uv);
  uv = warpEye(uRight[0], uRight[1], uRight[2], uv);
  uv = clamp(uv, vec2(0.0), vec2(1.0));
  outColor = texture(uTex, uv);
}`;

// ---- landmark math ----------------------------------------------------------

interface Ptv { x: number; y: number }

interface EyeMeasurement {
  iris: { x: number; y: number };
  dx: number; // iris offset across the eye, normalized by corner span
  dy: number; // iris offset down the eye, normalized by lid span
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

function measureEye(
  face: Ptv[],
  irisStart: number,
  outer: number,
  inner: number,
  topLid: number,
  bottomLid: number,
): EyeMeasurement {
  const c0 = face[outer], c1 = face[inner];
  const minX = Math.min(c0.x, c1.x);
  const maxX = Math.max(c0.x, c1.x);
  const midX = (minX + maxX) / 2;

  let ix = 0, iy = 0;
  for (let i = irisStart; i < irisStart + 5; i++) {
    ix += face[i].x;
    iy += face[i].y;
  }
  ix /= 5;
  iy /= 5;

  const width = Math.max(maxX - minX, 1e-4);
  const lidTop = face[topLid].y;
  const lidBot = face[bottomLid].y;
  const height = Math.max(lidBot - lidTop, 1e-4);
  const midY = (lidTop + lidBot) / 2;

  return {
    iris: { x: ix, y: iy },
    dx: (ix - midX) / width,
    dy: (iy - midY) / height,
    width,
    height,
    centerX: midX,
    centerY: midY,
  };
}

interface WarpState {
  cx: number; cy: number;
  sx: number; sy: number;
  rx: number; ry: number;
  amount: number;
}

const zeroWarp = (): WarpState => ({
  cx: 0.5, cy: 0.5, sx: 0, sy: 0, rx: 0.06, ry: 0.04, amount: 0,
});

const MAX_SHIFT_X = 0.03; // fraction of frame width — keeps the warp believable
const MAX_SHIFT_Y = 0.022;
const SMOOTH = 0.28; // temporal smoothing factor per rendered frame

// ---- corrector --------------------------------------------------------------

export class EyeContactCorrector {
  private gl: WebGL2RenderingContext | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null; // fallback compositing
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private uTex: WebGLUniformLocation | null = null;
  private uAspect: WebGLUniformLocation | null = null;
  private uLeft: WebGLUniformLocation | null = null;
  private uRight: WebGLUniformLocation | null = null;

  private landmarker: FaceLandmarker | null = null;
  private modelPromise: Promise<void> | null = null;
  private error: string | null = null;

  private enabled = false;
  private rafId: number | null = null;
  private lastVideoTime = -1;
  private detectTick = 0;
  private tracking = false;

  private left = zeroWarp();
  private right = zeroWarp();
  private targetLeft = zeroWarp();
  private targetRight = zeroWarp();

  private canvas: HTMLCanvasElement | null = null;
  private video: HTMLVideoElement | null = null;

  private listeners = new Set<(s: CorrectorStatus) => void>();

  onStatus(cb: (s: CorrectorStatus) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private emit() {
    const s: CorrectorStatus = {
      ready: this.gl !== null && this.landmarker !== null && !this.error,
      loading: this.modelPromise !== null,
      error: this.error,
      tracking: this.tracking,
    };
    this.listeners.forEach((cb) => cb(s));
  }

  get available() {
    return this.gl !== null && !this.error;
  }

  attach(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    this.canvas = canvas;
    this.video = video;
    if (!this.gl && !this.ctx2d) this.initGL(canvas);
  }

  private initGL(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true, // required for canvas.captureStream()
    });
    if (!gl) {
      // Canvas 2D fallback: still renders the feed (no warp), app keeps working.
      this.ctx2d = canvas.getContext("2d");
      return;
    }
    try {
      const compile = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(sh) ?? "shader compile failed");
        }
        return sh;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) ?? "program link failed");
      }
      this.program = prog;
      gl.useProgram(prog);
      gl.bindVertexArray(gl.createVertexArray());

      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.uTex = gl.getUniformLocation(prog, "uTex");
      this.uAspect = gl.getUniformLocation(prog, "uAspect");
      this.uLeft = gl.getUniformLocation(prog, "uLeft[0]");
      this.uRight = gl.getUniformLocation(prog, "uRight[0]");
      gl.uniform1i(this.uTex, 0);
      this.gl = gl;
    } catch (e) {
      this.gl = null;
      this.ctx2d = canvas.getContext("2d");
      this.error = e instanceof Error ? e.message : "WebGL initialization failed.";
    }
  }

  async loadModel(): Promise<void> {
    if (this.landmarker) return;
    if (!this.modelPromise) {
      this.modelPromise = (async () => {
        try {
          const { FilesetResolver, FaceLandmarker } = await import(
            "@mediapipe/tasks-vision"
          );
          const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
          this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
            runningMode: "VIDEO",
            numFaces: 1,
          });
        } catch (e) {
          this.error =
            e instanceof Error
              ? `Could not load the gaze-correction model (${e.message}). Check your network connection.`
              : "Could not load the gaze-correction model.";
        } finally {
          this.modelPromise = null;
          this.emit();
        }
      })();
    }
    this.emit();
    return this.modelPromise;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
    void this.loadModel();
    this.scheduleFrame();
    this.emit();
  }

  disable() {
    this.enabled = false;
    this.tracking = false;
    this.targetLeft = zeroWarp();
    this.targetRight = zeroWarp();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.emit();
  }

  get isEnabled() {
    return this.enabled;
  }

  captureStream(fps = 60): MediaStream | null {
    return this.canvas?.captureStream(fps) ?? null;
  }

  destroy() {
    this.disable();
    this.landmarker?.close();
    this.landmarker = null;
    const gl = this.gl;
    if (gl) {
      if (this.texture) gl.deleteTexture(this.texture);
      if (this.program) gl.deleteProgram(this.program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.listeners.clear();
  }

  // ---- render loop ----------------------------------------------------------

  private scheduleFrame() {
    if (this.rafId !== null || !this.enabled) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.frame();
      if (this.enabled) this.scheduleFrame();
    });
  }

  private frame() {
    const canvas = this.canvas;
    const video = this.video;
    if (!canvas || !video) return;
    if (video.readyState < 2 || video.videoWidth === 0) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.min(1, 1920 / vw);
    const w = Math.round(vw * scale);
    const h = Math.round(vh * scale);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      this.gl?.viewport(0, 0, w, h);
    }

    // Inference at ~30Hz; render every rAF for 60fps smoothness.
    this.detectTick++;
    if (
      this.landmarker &&
      this.detectTick % 2 === 0 &&
      video.currentTime !== this.lastVideoTime
    ) {
      this.lastVideoTime = video.currentTime;
      try {
        const res = this.landmarker.detectForVideo(video, performance.now());
        const face = res.faceLandmarks?.[0];
        if (face && face.length > 477) this.updateWarps(face);
        else this.releaseLock();
      } catch {
        /* transient inference hiccup — keep previous warps */
      }
    }

    if (this.gl && this.program) this.renderGL(canvas);
    else this.render2D(canvas);
  }

  /**
   * Turn landmarks into warp descriptors. The sampled eye content is shifted
   * opposite to the measured gaze offset so the pupil lands back in the center
   * of the eye — i.e. the viewer sees direct eye contact with the lens even
   * when the speaker reads downward or looks aside. Head yaw is folded in via
   * the iris-to-nose-axis delta so sideways head turns also get corrected.
   */
  private updateWarps(face: Ptv[]) {
    const eL = measureEye(face, 468, 33, 133, 159, 145);
    const eR = measureEye(face, 473, 362, 263, 386, 374);
    const faceAxisX = face[1].x; // nose tip — stable symmetry reference

    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const mk = (e: EyeMeasurement, sideSign: number): WarpState => {
      // Global component: how far the iris sits from the face's symmetry axis.
      const globalDx = clamp(((e.iris.x - faceAxisX) / Math.max(e.width, 1e-4)) * sideSign, 3) / 3;
      const dx = clamp(e.dx + globalDx * 0.35, 1);
      const dy = clamp(e.dy, 1);
      return {
        cx: e.centerX,
        cy: 1 - e.centerY, // image coords (y-down) → GL texture coords (y-up)
        // Shift the sampling window toward where the iris currently is, which
        // makes the composited pupil appear centered in the eye socket.
        sx: clamp(dx * e.width * 0.9, MAX_SHIFT_X),
        sy: clamp(dy * e.height * 0.9, MAX_SHIFT_Y),
        rx: Math.max(e.width * 0.85, 0.02),
        ry: Math.max(e.height * 1.6, 0.015),
        amount: 1,
      };
    };

    this.targetLeft = mk(eL, 1);
    this.targetRight = mk(eR, -1);
    this.tracking = true;
  }

  private releaseLock() {
    this.targetLeft = zeroWarp();
    this.targetRight = zeroWarp();
    this.tracking = false;
  }

  private step(cur: WarpState, tgt: WarpState): WarpState {
    const l = (a: number, b: number) => a + (b - a) * SMOOTH;
    return {
      cx: l(cur.cx, tgt.cx),
      cy: l(cur.cy, tgt.cy),
      sx: l(cur.sx, tgt.sx),
      sy: l(cur.sy, tgt.sy),
      rx: l(cur.rx, tgt.rx),
      ry: l(cur.ry, tgt.ry),
      amount: l(cur.amount, tgt.amount),
    };
  }

  private renderGL(canvas: HTMLCanvasElement) {
    const gl = this.gl!;
    try {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video!);
    } catch {
      return; // frame not ready
    }

    this.left = this.step(this.left, this.targetLeft);
    this.right = this.step(this.right, this.targetRight);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(this.program);
    gl.uniform2f(this.uAspect, canvas.width / Math.max(1, canvas.height), 1);

    // vec3[3] array layout:
    //   [0] = center.xy | 0
    //   [1] = shift.xy * amount | amount
    //   [2] = radius.xy | 0
    const pack = (w: WarpState) =>
      new Float32Array([
        w.cx, w.cy, 0,
        w.sx * w.amount, w.sy * w.amount, w.amount,
        w.rx, w.ry, 0,
      ]);
    gl.uniform3fv(this.uLeft, pack(this.left));
    gl.uniform3fv(this.uRight, pack(this.right));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Canvas 2D fallback — mirrors the raw frame so the studio still works. */
  private render2D(canvas: HTMLCanvasElement) {
    const ctx = this.ctx2d ?? canvas.getContext("2d");
    if (!ctx || !this.video) return;
    this.ctx2d = ctx;
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
  }
}
