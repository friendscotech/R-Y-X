import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Contact us"
      description="A contact page is on the way. In the meantime, thanks for your patience."
    />
  );
}
