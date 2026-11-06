import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <PlaceholderPage
      title="About PixelTools"
      description="We're putting together more about PixelTools and the people behind it. Check back soon."
    />
  );
}
