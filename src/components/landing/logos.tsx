const companies = [
  "Northwind Labs",
  "Aurora Media",
  "Brightroom",
  "Signal & Co",
  "Loop Studio",
  "Vertex Films",
];

export function Logos() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Trusted by creators and teams at
        </p>
        <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
