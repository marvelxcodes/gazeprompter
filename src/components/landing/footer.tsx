import Link from "next/link";
import { Aperture } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2 text-zinc-400">
          <Aperture className="h-4.5 w-4.5 text-white" />
          <span className="text-sm font-medium text-white">PromptVision</span>
          <span className="text-xs">© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="#features" className="transition-colors hover:text-white">
            Features
          </Link>
          <Link href="/login" className="transition-colors hover:text-white">
            Sign in
          </Link>
          <Link href="/studio" className="transition-colors hover:text-white">
            Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
