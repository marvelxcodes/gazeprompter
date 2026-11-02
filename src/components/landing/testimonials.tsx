import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to reshoot a 3-minute intro eight times. With GazePrompter I nail it in one take — my eyes never leave the lens.",
    name: "Maya Chen",
    role: "YouTuber · 1.2M subscribers",
    initials: "MC",
    color: "from-indigo-500 to-violet-500",
  },
  {
    quote:
      "The voice-tracked prompter is eerily good. It actually pauses when I pause and catches up when I rephrase a sentence.",
    name: "Daniel Okafor",
    role: "Founder, Loop Studio",
    initials: "DO",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    quote:
      "We recorded an entire 12-module course without a single retake for eye-line issues. It paid for itself in week one.",
    name: "Sofia Martins",
    role: "Course creator",
    initials: "SM",
    color: "from-fuchsia-500 to-rose-500",
  },
  {
    quote:
      "Everything happens in my browser — nothing uploads anywhere. Our legal team approved it in a day.",
    name: "James Whitfield",
    role: "Head of Content, Brightroom",
    initials: "JW",
    color: "from-sky-500 to-indigo-500",
  },
  {
    quote:
      "My LinkedIn videos finally feel like I'm talking to each person individually. Engagement is up 40%.",
    name: "Priya Raman",
    role: "Executive coach",
    initials: "PR",
    color: "from-emerald-500 to-sky-500",
  },
  {
    quote:
      "No desktop app, no plugin, no rendering queue. Open a tab, hit record, download, done. That's the whole workflow.",
    name: "Alex Novak",
    role: "Podcast host",
    initials: "AN",
    color: "from-amber-400 to-orange-500",
  },
];

function Avatar({
  initials,
  color,
}: {
  initials: string;
  color: string;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${color}`}
    >
      {initials}
    </span>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Loved by creators
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Join thousands recording{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              better takes
            </span>
          </h2>
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </span>
            <span className="text-sm text-zinc-400">
              4.9 average from 2,300+ recordings this month
            </span>
          </div>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="break-inside-avoid rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md transition-colors hover:border-zinc-700"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-zinc-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar initials={t.initials} color={t.color} />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
