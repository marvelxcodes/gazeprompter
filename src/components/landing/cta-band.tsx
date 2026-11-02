import { GoogleSignInButton } from "@/components/google-sign-in-button";

export function CTABand() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-zinc-900 to-zinc-950 px-8 py-16 text-center shadow-2xl shadow-indigo-950/40 sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
          >
            <div className="absolute left-1/2 top-[-120px] h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          </div>

          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Your audience deserves{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                your eyes on them
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Record your first corrected take in under two minutes. Free
              forever, no credit card, nothing uploaded.
            </p>
            <div className="mx-auto mt-9 flex max-w-xs justify-center">
              <GoogleSignInButton label="Start recording for free" size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
