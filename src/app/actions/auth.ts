"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInWithGoogle(redirectTo: string = "/studio") {
  await signIn("google", { redirectTo });
}

export async function signOutFromStudio() {
  await signOut({ redirectTo: "/" });
}
