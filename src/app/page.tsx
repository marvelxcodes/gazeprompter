import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-zinc-950">
      <Navbar />
      <Hero />
      <FeaturesGrid />
      <Footer />
    </main>
  );
}
