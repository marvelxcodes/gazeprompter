const faqs = [
  {
    q: "Does my video ever get uploaded to a server?",
    a: "No. Face tracking, gaze redirection and recording all run locally in your browser using WebGPU/WebGL2 and MediaPipe. Not a single frame leaves your device — even on the paid plans.",
  },
  {
    q: "How realistic does the eye contact look?",
    a: "The engine only redraws the small region around your irises using a displacement shader, blended with your natural skin tones and lighting. On camera it reads as genuine eye contact; up close it holds up in nearly every framing we've tested.",
  },
  {
    q: "What if I stutter, skip a line or ad-lib?",
    a: "That's exactly what the fuzzy-matching voice tracker is built for. It maps what you actually said — not word-perfect transcripts — to the nearest position in your script, so the prompter pauses, rewinds or catches up without you touching anything.",
  },
  {
    q: "Do I need to install an app or plugin?",
    a: "No. GazePrompter runs entirely in any modern browser — Chrome, Edge, Arc or Safari. Laptop, iPad or phone. If you can open a tab, you can record.",
  },
  {
    q: "Which browsers and devices are supported?",
    a: "Any browser with WebGL2 and the Web Speech API. Best experience on recent Chrome, Edge and Arc on desktop. Safari works with voice-tracking limitations; we recommend Chrome on iOS for full functionality.",
  },
  {
    q: "Can I edit the exported file in Premiere or Final Cut?",
    a: "Yes. You export a standard .webm file with the corrected gaze already composited in. Drop it into any editor, or convert to MP4 with our recommended one-click settings.",
  },
  {
    q: "Is there really a free plan?",
    a: "Yes — three full recordings a month with 720p correction, forever free, no credit card. Upgrade to Creator only when you need unlimited takes and 1080p60 exports.",
  },
  {
    q: "What about team use and security reviews?",
    a: "Because processing is client-side, most security reviews are quick: nothing sensitive is transmitted or stored. Team plans add shared workspaces, roles and SSO on request.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-white [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-transform duration-200 group-open:rotate-45">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 pr-10 text-sm leading-relaxed text-zinc-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
