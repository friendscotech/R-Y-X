import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Privacy Policy"
      description="Our Privacy Policy is being prepared and will be published here before launch."
    />
  );
}
