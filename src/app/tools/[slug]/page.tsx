import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/data/tools";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { ToolIcon } from "@/components/ui/Icons";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  return tool ? { title: tool.name, description: tool.description } : {};
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <PlaceholderPage
      title={tool.name}
      description={`${tool.description} This tool is in development and will be available here soon.`}
      icon={<ToolIcon name={tool.icon} className="size-7" />}
    />
  );
}
