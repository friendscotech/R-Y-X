import Link from "next/link";
import { legalNav, siteConfig } from "@/data/site";
import { toolHref, tools } from "@/data/tools";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const linkClass = "rounded text-[15px] text-muted transition-colors hover:text-ink";

export function Footer() {
  const year = new Date().getFullYear();
  const half = Math.ceil(tools.length / 2);

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">{siteConfig.description}</p>
          </div>

          <nav aria-labelledby="footer-tools" className="md:col-span-5">
            <h2 id="footer-tools" className="text-sm font-semibold text-ink">
              Tools
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 min-[400px]:grid-cols-2">
              {[tools.slice(0, half), tools.slice(half)].map((column, i) => (
                <ul key={i} className="space-y-3">
                  {column.map((tool) => (
                    <li key={tool.slug}>
                      <Link href={toolHref(tool)} className={linkClass}>
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>

          <nav aria-labelledby="footer-company" className="md:col-span-3">
            <h2 id="footer-company" className="text-sm font-semibold text-ink">
              Company
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Your images are handled in your browser, not uploaded to a server.</p>
        </div>
      </Container>
    </footer>
  );
}
