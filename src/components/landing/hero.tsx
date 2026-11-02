import { ArrowRight, ScanEye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-200px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Badge className="mb-8">
          <ScanEye className="h-3.5 w-3.5 text-indigo-400" />
          WebGPU-powered eye contact AI · 100% in-browser
        </Badge>

        <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tighter text-white sm:text-6xl md:text-7xl">
          Look at the Lens.{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            Read the Script.
          </span>{" "}
          AI Handles the Rest.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400">
          PromptVision redraws your gaze directly into the camera in real time
          and scrolls your teleprompter with your own voice. No desktop apps,
          no plugins, no uploads — everything runs in your browser.
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-4">
          <GoogleSignInButton label="Start Recording for Free" size="xl" />
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            Free forever plan · No credit card required ·{" "}
            <ArrowRight className="h-3 w-3" /> Sign in with Google
          </p>
        </div>

        {/* Studio preview mock */}
        <div className="relative mt-20 w-full max-w-5xl">
          <div className="absolute -inset-x-8 -top-8 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-3 backdrop-blur-md">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-medium text-zinc-500">
                app.promptvision.ai/studio
              </span>
            </div>
            <div className="grid aspect-video w-full grid-cols-3 gap-0 bg-zinc-950">
              <div className="col-span-2 relative flex items-center justify-center border-r border-zinc-800/60">
                <div className="flex flex-col items-center gap-3 text-zinc-600">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800 bg-white/5">
                    <ScanEye className="h-9 w-9 text-zinc-500" />
                  </div>
                  <span className="text-xs">Eye Contact AI · ON</span>
                </div>
                <span className="absolute bottom-5 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] ring-4 ring-red-600/20" />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                  Teleprompter
                </p>
                <p className="text-sm leading-relaxed text-zinc-500 line-through decoration-zinc-700">
                  Welcome to PromptVision, the future of browser recording…
                </p>
                <p className="rounded-lg bg-white/5 p-2 text-[15px] font-medium leading-relaxed text-white backdrop-blur-md">
                  …where your eyes meet the lens and your words set the pace.
                </p>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Just press record and speak naturally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
