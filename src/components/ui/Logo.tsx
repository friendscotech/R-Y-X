import Link from "next/link";

/** Temporary text-based logo. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-md text-[19px] font-semibold tracking-tight text-ink ${className}`}
    >
      Pixel<span className="text-accent-strong">Tools</span>
    </Link>
  );
}
