"use client";

import { useActionState } from "react";
import { signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/google-icon";

export function GoogleSignInButton({
  label = "Continue with Google",
  redirectTo = "/studio",
  size = "lg",
}: {
  label?: string;
  redirectTo?: string;
  size?: "md" | "lg" | "xl";
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await signInWithGoogle(redirectTo);
        return null;
      } catch {
        return "Unable to sign in. Please check your Google OAuth configuration.";
      }
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <Button
        type="submit"
        variant="secondary"
        size={size}
        disabled={isPending}
        className="w-full max-w-xs border-zinc-700 bg-white/5 backdrop-blur-md hover:bg-white/10"
      >
        <GoogleIcon className="shrink-0" />
        {isPending ? "Redirecting…" : label}
      </Button>
      {state ? <p className="text-xs text-red-400">{state}</p> : null}
    </form>
  );
}
