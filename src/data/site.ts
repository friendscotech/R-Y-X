export const siteConfig = {
  name: "PixelTools",
  description:
    "Free online image tools that work right in your browser. Compress, resize, convert and edit images without installing anything.",
};

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/#tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];
