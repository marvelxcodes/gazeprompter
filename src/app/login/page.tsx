import type { Metadata } from "next";
import Link from "next/link";
import { ScanEye, AudioLines, ShieldOff } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in · GazePrompter",
  description:
    "Sign in to GazePrompter to open your browser-based AI recording studio.",
};

const perks = [
  {
    icon: ScanEye,
    title: "Perfect eye contact",
    description: "AI redraws your gaze to the lens in real time.",
  },
  {
    icon: AudioLines,
    title: "Voice-driven prompter",
    description: "The script follows your pace — pauses, stumbles and all.",
  },
  {
    icon: ShieldOff,
    title: "Nothing is uploaded",
    description: "Tracking and recording run 100% inside your browser.",
  },
];

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-zinc-950 lg:flex-row">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-600/15 to-transparent blur-3xl lg:left-[25%]" />
      </div>

      {/* Left marketing panel (hidden on small screens) */}
      <section className="relative hidden flex-col justify-between border-r border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-950 to-indigo-950/40 p-12 lg:flex lg:w-[46%] xl:p-16">
        <Logo size="lg" />

        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
            Look at the lens.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              Read the script.
            </span>{" "}
            AI handles the rest.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            Thousands of creators record one-take videos with GazePrompter.
            Sign in to open your studio.
          </p>

          <ul className="mt-10 space-y-6">
            {perks.map((perk) => (
              <li key={perk.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                  <perk.icon className="h-5 w-5 text-indigo-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {perk.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">
                    {perk.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure className="max-w-md rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md">
          <blockquote className="text-sm leading-relaxed text-zinc-300">
            “I used to reshoot a three-minute intro eight times. Now I nail it
            in one take.”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
              MC
            </span>
            <span className="text-xs text-zinc-500">
              Maya Chen · YouTuber, 1.2M subscribers
            </span>
          </figcaption>
        </figure>
      </section>

      {/* Right sign-in column */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">
            <h1 className="text-center text-2xl font-bold tracking-tight text-white">
              Welcome to GazePrompter
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-zinc-400">
              Sign in with Google to open the recording studio. Your footage
              never leaves this browser.
            </p>

            <div className="mt-8">
              <GoogleSignInButton label="Continue with Google" size="lg" />
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-zinc-800" />
              <span className="text-[11px] uppercase tracking-widest text-zinc-600">
                or
              </span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <Link
              href="/studio"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-zinc-700/70 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-white"
            >
              Continue as guest (limited)
            </Link>

            <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
              By continuing you agree to our{" "}
              <Link href="#" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline">
                Privacy Policy
              </Link>
              . Camera and microphone access stays local to your device.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            New here?{" "}
            <Link
              href="/"
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Learn about GazePrompter →
            </Link>
          </p>
        </div>
      </section>

      {/* back-to-home floating link (top-left, above the lg panel logo) */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-10 hidden items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:text-white lg:flex lg:!left-auto lg:right-6 lg:top-6"
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path
            d="M13 8H3m0 0l4-4M3 8l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to home
      </Link>
    </main>
  );
}
