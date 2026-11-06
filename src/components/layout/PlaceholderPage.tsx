import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ArrowLeftIcon } from "@/components/ui/Icons";

type PlaceholderPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

/** Honest "coming soon" destination for routes that are planned but not built yet. */
export function PlaceholderPage({ eyebrow = "Coming soon", title, description, icon }: PlaceholderPageProps) {
  return (
    <section aria-labelledby="placeholder-heading" className="bg-surface">
      <Container className="flex min-h-[60vh] items-center py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-12">
          {icon && (
            <span
              className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-strong"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <p className="mt-5 text-sm font-semibold text-accent-strong">{eyebrow}</p>
          <h1 id="placeholder-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              <ArrowLeftIcon className="size-4" />
              Back to home
            </Link>
            <Link
              href="/#tools"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-5 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              See all tools
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
