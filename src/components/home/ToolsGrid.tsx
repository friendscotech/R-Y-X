import { tools } from "@/data/tools";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ToolCard } from "@/components/home/ToolCard";

export function ToolsGrid() {
  return (
    <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="tools-heading"
          eyebrow="Popular tools"
          title="Pick the right tool for the job"
          description="Ten focused utilities for the everyday image tasks you do most."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:mt-12 xl:grid-cols-5">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
