import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_24px_rgba(255,255,255,0.15)]",
  secondary:
    "bg-zinc-800/80 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/60",
  outline:
    "border border-zinc-700/70 text-zinc-200 hover:bg-zinc-800/50 hover:text-white",
  ghost: "text-zinc-300 hover:bg-zinc-800/60 hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-7 text-base rounded-xl gap-2",
  xl: "h-14 px-9 text-lg rounded-2xl gap-2.5",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
