import type { Metadata } from "next";
import { StudioClient } from "@/components/studio/studio-client";

export const metadata: Metadata = {
  title: "Studio · GazePrompter",
};

// Protected route (see src/middleware.ts) — always has a session here.
export default function StudioPage() {
  return <StudioClient />;
}
