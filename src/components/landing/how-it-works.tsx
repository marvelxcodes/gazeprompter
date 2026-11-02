import { FileText, Mic, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Paste your script",
    description:
      "Drop in your talking points or full verbatim script. GazePrompter formats it into a teleprompter-ready flow with natural pacing cues.",
    accent: "from-indigo-500/20 to-transparent border-indigo-500/30",
    badge: "text-indigo-300 bg-indigo-500/10 ring-indigo-500/20",
  },
  {
    number: "02",
    icon: Mic,
    title: "Press record & speak",
    description:
      "The prompter follows your voice line by line while the eye-contact engine locks your gaze to the lens. Stumble? It catches up seamlessly.",
    accent: "from-violet-500/20 to-transparent border-violet-500/30",
    badge: "text-violet-300 bg-violet-500/10 ring-violet-500/20",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & publish",
    description:
      "Stop and your corrected take is ready — a crisp .webm you can post straight to YouTube, LinkedIn or your course platform.",
    accent: "from-fuchsia-500/20 to-transparent border-fuchsia-500/30",
    badge: "text-fuchsia-300 bg-fuchsia-500/10 ring-fuchsia-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-600/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            From script to published in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              three steps
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            No editing marathon. No prompter operator. No teleprompter glasses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`relative overflow-hidden rounded-2xl border bg-zinc-900/40 p-8 backdrop-blur-md transition-colors hover:bg-zinc-900/70 ${step.accent.split(" ").filter((c) => c.startsWith("border")).join(" ")}`}
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-b ${step.accent.split(" ").filter((c) => !c.startsWith("border")).join(" ")}`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${step.badge}`}
                  >
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-4xl font-bold tracking-tighter text-white/10">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
