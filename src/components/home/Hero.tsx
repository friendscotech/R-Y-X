import { Container } from "@/components/ui/Container";
import { ImageUploader } from "@/components/home/ImageUploader";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b border-line bg-surface">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-white px-3 py-1 text-xs font-semibold text-accent-strong sm:text-sm">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Free online image tools
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-[2rem] leading-[1.12] font-semibold tracking-tight text-balance text-ink min-[375px]:text-[2.25rem] sm:text-5xl lg:text-[3.5rem]"
          >
            Everything You Need to Work With Images.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            Compress, resize, convert and edit images effortlessly. Free online image tools that work right in your
            browser.
          </p>
        </div>

        <div id="upload" className="mx-auto mt-10 max-w-3xl scroll-mt-24 sm:mt-12">
          <ImageUploader />
        </div>
      </Container>
    </section>
  );
}
