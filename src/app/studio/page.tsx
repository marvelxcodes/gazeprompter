import type { Metadata } from "next";
import { StudioClient } from "@/components/studio/studio-client";

export const metadata: Metadata = {
  title: "Studio · GazePrompter",
  description:
    "Record with a voice-tracked teleprompter and real-time eye contact correction.",
};

export default function StudioPage() {
  return <StudioClient />;
}
