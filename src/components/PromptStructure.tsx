import { Wand2 } from "lucide-react";

export function PromptStructure({
  title = "How the AI uses your inputs",
  items,
}: {
  title?: string;
  items: { label: string; desc: string }[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <Wand2 className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.label} className="rounded-lg bg-background/60 px-3 py-2 text-xs">
            <span className="block font-semibold text-foreground">{i.label}</span>
            <span className="text-muted-foreground">{i.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
