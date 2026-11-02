import type { Metadata } from "next";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in · PromptVision",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/15 to-transparent blur-3xl" />
      </div>

      <Link href="/" className="absolute left-6 top-6 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/60 bg-white/10 backdrop-blur-md">
          <Aperture className="h-5 w-5 text-white" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          PromptVision
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">
        <h1 className="text-center text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-zinc-400">
          Sign in with Google to open the recording studio. Your footage never
          leaves this browser.
        </p>

        <div className="mt-8">
          <GoogleSignInButton label="Sign in with Google" size="lg" />
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-4">
          <p className="text-center text-xs leading-relaxed text-zinc-500">
            By continuing you agree that camera and microphone access stays
            local to your device.
          </p>
        </div>
      </div>
    </main>
  );
}
