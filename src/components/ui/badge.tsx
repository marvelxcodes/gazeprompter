import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-zinc-700/60",
        "bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wide text-zinc-300",
        "backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
