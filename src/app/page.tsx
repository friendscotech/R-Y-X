import { Hero } from "@/components/home/Hero";
import { ToolsGrid } from "@/components/home/ToolsGrid";
import { Benefits } from "@/components/home/Benefits";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolsGrid />
      <Benefits />
      <HowItWorks />
    </>
  );
}
