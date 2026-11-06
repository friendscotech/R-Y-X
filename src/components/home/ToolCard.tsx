import Link from "next/link";
import type { Tool } from "@/data/tools";
import { toolHref } from "@/data/tools";
import { ArrowRightIcon, ToolIcon } from "@/components/ui/Icons";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={toolHref(tool)}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-lift focus-visible:border-accent-line sm:p-6"
    >
      <span
        className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong transition-colors group-hover:bg-accent group-hover:text-white"
        aria-hidden="true"
      >
        <ToolIcon name={tool.icon} className="size-[22px]" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{tool.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-strong">
        Open tool
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
