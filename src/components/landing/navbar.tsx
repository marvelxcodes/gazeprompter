import Link from "next/link";
import { Aperture } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-zinc-700/60">
            <Aperture className="h-5 w-5 text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            PromptVision
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="#features"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Features
          </Link>
          <Link
            href="/studio"
            className="rounded-xl border border-zinc-700/70 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800/60 hover:text-white"
          >
            Open Studio
          </Link>
        </div>
      </nav>
    </header>
  );
}
