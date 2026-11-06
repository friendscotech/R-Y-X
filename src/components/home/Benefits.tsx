import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BoltIcon, GiftIcon, MonitorIcon, ShieldIcon } from "@/components/ui/Icons";

type Benefit = { title: string; description: string; icon: ReactNode };

const iconClass = "size-[22px]";

const benefits: Benefit[] = [
  {
    title: "Free to use",
    description: "Every tool is free, with no account or sign-up needed to get started.",
    icon: <GiftIcon className={iconClass} />,
  },
  {
    title: "Browser-based processing",
    description: "Tools are designed to run in your web browser, so there's nothing to download or install.",
    icon: <MonitorIcon className={iconClass} />,
  },
  {
    title: "Privacy-focused",
    description: "Images are handled on your device wherever possible instead of being sent to a server.",
    icon: <ShieldIcon className={iconClass} />,
  },
  {
    title: "Simple and fast",
    description: "A clean, focused interface helps you get from upload to result in just a few steps.",
    icon: <BoltIcon className={iconClass} />,
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-heading" className="border-y border-line bg-surface py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="benefits-heading"
          eyebrow="Why choose us"
          title="Built to make image work easier"
          description="Practical tools with a clear focus on simplicity and respect for your files."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong" aria-hidden="true">
                {b.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
