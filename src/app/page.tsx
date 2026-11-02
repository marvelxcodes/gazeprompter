import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Logos } from "@/components/landing/logos";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTABand } from "@/components/landing/cta-band";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-zinc-950">
      <Navbar />
      <Hero />
      <Logos />
      <FeaturesGrid />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABand />
      <Footer />
    </main>
  );
}
