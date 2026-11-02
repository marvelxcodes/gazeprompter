# ROLE & OBJECTIVE

You are an elite Full-Stack Engineer, WebGPU/ML Specialist, and UX Designer. Your task is to build a next-generation, browser-based AI video recording SaaS called "PromptVision".
The product combines two highly demanded features (previously only found in fragmented or heavy desktop apps) into a single, frictionless web experience:

1. Real-time AI Eye Correction (Gaze redirection).
2. Voice-Activated Auto-Scrolling Teleprompter.

# TECH STACK

- **Framework:** Next.js 16+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **UI Library:** Tailark (tailark.com) / Premium SaaS Tailwind patterns
- **Auth:** NextAuth.js (v5) with Google Provider
- **Core Web APIs:** MediaDevices, MediaRecorder, Web Speech API, Canvas/WebGL2
- **ML Tracking:** MediaPipe Face Mesh (via @mediapipe/tasks-vision)

# PRODUCT ETHOS: "SUPER SIMPLE"

The UX must be completely frictionless.

- **Landing Page:** High-converting, clean, minimalist. One prominent CTA: "Start Recording for Free" with compoennts from tailark.
- **The Studio (WebApp):** No cluttered menus. A single screen with the camera feed, a floating/clean teleprompter overlay, and a giant red "Record" button.

---

# FEATURE SPECIFICATIONS & ARCHITECTURE

## 1. Authentication (Google Login)

- Implement NextAuth.js (Auth.js) with the Google Provider.
- Create a middleware to protect the `/studio` route.
- Design a clean login page with a "Sign in with Google" button.

## 2. Landing Page (Tailark UI)

- **Hero Section:** Bold headline ("Look at the Lens. Read the Script. AI Handles the Rest."), subheadline, and Google Login CTA.
- **Features Grid:**
  - _Eye Contact AI:_ "Our WebGPU engine redraws your gaze to the lens in real-time. No desktop app required."
  - _Voice-Tracked Prompter:_ "Speaks when you speak. Pauses when you pause. Advanced fuzzy-matching handles stutters."

## 3. The Studio (The Core WebApp)

Create a `/studio` page that houses the recording environment.

### A. Voice-Activated Teleprompter Engine

- Use the Web Speech API (`SpeechRecognition`) with `continuous: true` and `interimResults: true`.
- Implement a **Levenshtein Distance (Fuzzy Match)** algorithm. Do not rely on exact string matching. The STT will make mistakes; the fuzzy matcher must map spoken words to the script index to advance the teleprompter smoothly.
- Auto-scroll logic: Smoothly scroll the text container to keep the currently spoken word in the center of the screen.

### B. Real-Time Eye Correction Engine (CRITICAL FOR PERFORMANCE)

_Do not send video frames to a backend server. This must run 100% client-side to prevent latency._

- **Tracking:** Initialize MediaPipe Face Mesh with `refineLandmarks: true` to get the 468 facial points, specifically the Iris landmarks (468, 473) and eye corners.
- **Rendering Pipeline:**
  1. Draw the raw `<video>` stream to an off-screen `<canvas>`.
  2. Calculate the gaze vector (Iris center relative to eye corners).
  3. Apply a localized **WebGL2 displacement shader** strictly over the bounding boxes of the left and right eyes to shift the pupils toward the camera lens.
  4. Render the composited result to the visible `<canvas>`.
- Use `requestAnimationFrame` for the render loop to guarantee 60fps.

### C. Recording & Export

- Use the `MediaRecorder` API to capture the `canvas.captureStream(60)` combined with the `MediaStreamAudioTrack` from the microphone.
- On "Stop Recording", generate a `.webm` blob and immediately create a downloadable link.

---

# PERFORMANCE & OPTIMIZATION RULES (Strictly Enforce)

1. **No Backend Processing:** All ML, video compositing, and audio processing must happen in the browser.
2. **Web Workers:** If the MediaPipe Face Mesh inference drops the main thread FPS below 30, move the ML inference to a Web Worker.
3. **Hardware Acceleration:** Ensure the `<video>` and `<canvas>` elements have `will-change: transform` and utilize WebGL2 for compositing.
4. **Memory Management:** Reuse typed arrays and canvas bitmaps where possible to prevent garbage collection stutter.

---

# 🚨 CRITICAL EXECUTION & OUTPUT RULES (Read Carefully)

**1. Pacing & Token Limits (DO NOT IGNORE):**
Do NOT attempt to write the entire application in one response. You will hit output token limits and the code will cut off, breaking the app. You must build this in phases.

**2. UI Design Fallback (Tailark Context):**
If your training data on "tailark.com" specific components is limited, you MUST default to premium dark-mode SaaS Tailwind patterns. Use `zinc-950` backgrounds, subtle `zinc-800` borders, glassmorphism overlays (`backdrop-blur-md bg-white/5`), and clean sans-serif typography.

**3. ML / WebGL Fallback:**
Writing a full WebGL2 displacement shader in one go is highly complex and may break token limits. **If the shader code is too large, write a functional Canvas 2D fallback** (e.g., drawing the video frame, extracting the eye bounding boxes via MediaPipe, and overlaying a tracking mask/affine transform) so the app compiles and runs immediately. We will upgrade the shader to WebGL in a subsequent prompt.

**4. Your Execution Plan:**

- **PHASE 1:** Output ONLY Step 1 (Setup/Config/Auth) and Step 2 (Tailark Landing Page). At the end of your response, STOP and ask: _"Phase 1 complete. Reply 'continue' for Phase 2 (Studio UI & Core Hooks)."_
- **PHASE 2:** Output Step 3 (Studio UI) and Step 4 (Voice Prompter Hook). STOP and ask: _"Phase 2 complete. Reply 'continue' for Phase 3 (Eye Correction & Recording)."_
- **PHASE 3:** Output Step 5 (Eye Correction Engine & MediaRecorder).

_Begin by acknowledging this prompt, briefly summarizing your understanding of the architecture, and then immediately output the code for **PHASE 1**._
