import { Badge } from "@/components/ui/badge";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

/**
 * Chatbase-style hero: centered eyebrow badge, giant headline with a
 * gradient keyword, supporting line, single primary CTA (Google sign-in),
 * trust microcopy, and a large product screenshot mock below.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-600/25 via-violet-600/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
        {/* faint grid */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <Badge className="mb-7">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          New — Real-time gaze correction, 100% in your browser
        </Badge>

        <h1 className="text-balance text-5xl font-bold leading-[1.04] tracking-tighter text-white sm:text-6xl md:text-7xl">
          Record videos with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            perfect eye contact
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 sm:text-xl">
          GazePrompter redirects your eyes to the camera lens while your voice
          drives the teleprompter. Write, record, publish — without ever looking
          away from your audience.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-center gap-3">
          <GoogleSignInButton label="Start recording for free" size="xl" />
          <p className="text-xs text-zinc-500">
            Free forever plan · No credit card required
          </p>
        </div>

        {/* Product mock — studio preview */}
        <div className="relative mt-16 w-full max-w-5xl">
          <div className="absolute -inset-x-10 -top-10 h-48 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/70 ring-1 ring-white/5">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-3 backdrop-blur-md">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 hidden rounded-md bg-zinc-800/80 px-3 py-1 text-[11px] font-medium text-zinc-500 sm:block">
                gazeprompter.ai/studio
              </span>
            </div>

            <div className="grid aspect-video w-full grid-cols-1 bg-zinc-950 sm:grid-cols-5">
              {/* camera feed with corrected gaze */}
              <div className="relative col-span-1 flex items-center justify-center border-b border-zinc-800/60 sm:col-span-3 sm:border-b-0 sm:border-r">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                  {/* face silhouette */}
                  <div className="relative">
                    <div className="mx-auto h-36 w-36 rounded-full bg-gradient-to-b from-zinc-700/60 to-zinc-800/40 shadow-inner sm:h-44 sm:w-44">
                      <div className="absolute left-1/2 top-[38%] flex -translate-x-1/2 gap-7 sm:gap-9">
                        <span className="relative flex h-5 w-9 items-center justify-center rounded-full bg-zinc-950 ring-1 ring-zinc-600/60 sm:h-6 sm:w-11">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
                        </span>
                        <span className="relative flex h-5 w-9 items-center justify-center rounded-full bg-zinc-950 ring-1 ring-zinc-600/60 sm:h-6 sm:w-11">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
                        </span>
                      </div>
                    </div>
                    {/* gaze lock indicator */}
                    <div className="absolute -right-10 top-[30%] flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[10px] font-medium text-indigo-300">
                        Eye contact ON
                      </span>
                    </div>
                  </div>

                  {/* record button */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <span className="block h-12 w-12 rounded-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] ring-4 ring-red-600/20" />
                  </div>
                </div>
              </div>

              {/* teleprompter panel */}
              <div className="col-span-1 flex flex-col justify-center gap-3 p-6 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                    Teleprompter
                  </p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                    Following your voice
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 line-through decoration-zinc-700">
                  Hey, I&apos;m so excited to show you what we built this
                  quarter…
                </p>
                <p className="rounded-lg bg-white/5 p-3 text-[15px] font-medium leading-relaxed text-white ring-1 ring-white/10 backdrop-blur-md">
                  …and every single frame you see is rendered live,{" "}
                  <span className="rounded bg-indigo-500/30 px-1 text-indigo-200">
                    right in your browser
                  </span>
                  .
                </p>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Just press record and speak naturally. We&apos;ll handle the
                  rest.
                </p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
                <p className="text-[10px] text-zinc-600">62% · 01:24 / 02:17</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
