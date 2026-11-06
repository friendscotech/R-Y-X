import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DownloadIcon, SlidersIcon, UploadIcon } from "@/components/ui/Icons";

type Step = { title: string; description: string; icon: ReactNode };

const steps: Step[] = [
  {
    title: "Upload your image",
    description: "Drag and drop a file or browse your device. JPG, PNG, WebP and GIF are supported.",
    icon: <UploadIcon className="size-[22px]" />,
  },
  {
    title: "Choose your tool and settings",
    description: "Pick what you want to do, then adjust options like size, quality or format.",
    icon: <SlidersIcon className="size-[22px]" />,
  },
  {
    title: "Download your result",
    description: "Preview the output and save the finished image straight to your device.",
    icon: <DownloadIcon className="size-[22px]" />,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Three simple steps"
          description="No learning curve. Just upload, adjust and download."
        />
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-ink text-white" aria-hidden="true">
                  {step.icon}
                </span>
                <span className="text-sm font-semibold text-muted" aria-hidden="true">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
