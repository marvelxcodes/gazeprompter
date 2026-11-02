import {
  ScanEye,
  AudioLines,
  Zap,
  ShieldOff,
  Clapperboard,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    icon: ScanEye,
    title: "Eye Contact AI",
    description:
      "Our in-browser engine redraws your gaze to the lens in real time. Read the script, look straight into the camera — every take.",
    accent: "text-indigo-400",
    glow: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: AudioLines,
    title: "Voice-Tracked Prompter",
    description:
      "Scrolls when you speak. Pauses when you pause. Advanced fuzzy-matching shrugs off stutters, ums and re-takes.",
    accent: "text-violet-400",
    glow: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Zap,
    title: "60fps GPU Pipeline",
    description:
      "468 facial landmarks tracked per frame while a WebGL2 compositor shifts your pupils — silky smooth at 60 frames a second.",
    accent: "text-fuchsia-400",
    glow: "bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    icon: ShieldOff,
    title: "Zero Uploads, Ever",
    description:
      "Your footage never leaves the tab. Tracking, compositing and recording all run 100% client-side. Private by architecture.",
    accent: "text-emerald-400",
    glow: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Clapperboard,
    title: "One-Click Export",
    description:
      "Stop recording and your .webm is ready to download — corrected gaze, burned-in quality, no rendering queue, no watermark.",
    accent: "text-amber-300",
    glow: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Share2,
    title: "Works Everywhere",
    description:
      "No desktop app, no plugin, no download. If it runs a modern browser — laptop, iPad or phone — it runs GazePrompter.",
    accent: "text-sky-400",
    glow: "bg-sky-500/10 border-sky-500/20",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything you need to sound like you wrote the script{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              live on camera
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Two superpowers previously locked inside heavy desktop apps —
            unified in a single browser tab.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <CardHeader>
                <span
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl border ${f.glow}`}
                >
                  <f.icon
                    className={`h-5 w-5 ${f.accent} transition-transform duration-300 group-hover:scale-110`}
                  />
                </span>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
