import { ScanEye, AudioLines, Zap, ShieldOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: ScanEye,
    title: "Eye Contact AI",
    description:
      "Our WebGPU engine redraws your gaze to the lens in real-time. No desktop app required.",
    accent: "text-indigo-400",
    glow: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: AudioLines,
    title: "Voice-Tracked Prompter",
    description:
      "Speaks when you speak. Pauses when you pause. Advanced fuzzy-matching handles stutters.",
    accent: "text-fuchsia-400",
    glow: "bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    icon: Zap,
    title: "60fps Rendering Pipeline",
    description:
      "MediaPipe Face Mesh tracks 468 landmarks per frame while a WebGL2 compositor shifts your pupils — all on the GPU.",
    accent: "text-amber-300",
    glow: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: ShieldOff,
    title: "Zero Uploads, Ever",
    description:
      "No frames ever leave your machine. Recording, tracking and compositing run 100% client-side.",
    accent: "text-emerald-400",
    glow: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Two superpowers. One frictionless studio.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Previously locked inside heavy desktop apps — now unified in a
            single tab.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group transition-colors duration-300 hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <CardHeader>
                <span
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl border ${f.glow}`}
                >
                  <f.icon className={`h-5.5 w-5.5 ${f.accent}`} />
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
