import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Terms of Use"
      description="Our Terms of Use are being prepared and will be published here before launch."
    />
  );
}
