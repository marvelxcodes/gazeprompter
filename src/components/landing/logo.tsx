import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * GazePrompter brand mark — a lens/aperture glyph inside a rounded tile,
 * paired with the wordmark. Used in navbar, footer and login page.
 */
export function Logo({
  href = "/",
  className,
  size = "md",
}: {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const tile = size === "lg" ? "h-9 w-9 rounded-xl" : "h-8 w-8 rounded-lg";
  const icon = size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]";
  const text =
    size === "lg"
      ? "text-[17px]"
      : size === "sm"
        ? "text-[13px]"
        : "text-[15px]";

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden",
          "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_rgba(99,102,241,0.45)]",
          tile
        )}
      >
        {/* aperture / eye glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(icon, "text-white")}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.4" fill="currentColor" />
          <path
            d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight text-white",
          text
        )}
      >
        Gaze<span className="text-indigo-400">Prompter</span>
      </span>
    </Link>
  );
}
