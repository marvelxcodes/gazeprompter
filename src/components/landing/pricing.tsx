import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

const plans = [
  {
    name: "Free",
    tagline: "For getting your first take in.",
    price: "$0",
    period: "/mo",
    ctaLabel: "Start for free",
    highlight: false,
    features: [
      "3 recordings per month",
      "720p eye-contact correction",
      "Voice-tracked teleprompter",
      "Watermarked export",
      "100% in-browser — always private",
    ],
  },
  {
    name: "Creator",
    tagline: "For weekly uploaders who ship.",
    price: "$19",
    period: "/mo",
    ctaLabel: "Upgrade to Creator",
    highlight: true,
    features: [
      "Unlimited recordings",
      "Full 1080p · 60fps correction",
      "Script library & formatting",
      "No watermark, direct download",
      "Priority rendering pipeline",
      "Email support",
    ],
  },
  {
    name: "Team",
    tagline: "For content teams and studios.",
    price: "$49",
    period: "/user/mo",
    ctaLabel: "Talk to us",
    highlight: false,
    features: [
      "Everything in Creator",
      "Shared script workspace",
      "Brand kit & lower-thirds",
      "Roles & usage analytics",
      "SSO on request",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Simple pricing,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              no surprises
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Start free forever. Upgrade when your channel does.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 backdrop-blur-md",
                plan.highlight
                  ? "border-indigo-500/50 bg-zinc-900/80 shadow-[0_0_60px_rgba(99,102,241,0.15)]"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.highlight ? "text-indigo-400" : "text-emerald-400"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.highlight ? (
                  <GoogleSignInButton label={plan.ctaLabel} size="md" />
                ) : (
                  <a
                    href="/login"
                    className={cn(
                      "inline-flex h-10 w-full items-center justify-center rounded-xl border text-sm font-medium transition-colors",
                      "border-zinc-700/70 text-zinc-200 hover:bg-zinc-800/60 hover:text-white"
                    )}
                  >
                    {plan.ctaLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
