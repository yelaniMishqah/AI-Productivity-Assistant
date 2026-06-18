import { useState } from "react";
import { Plus, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function EditableList({
  items,
  onChange,
  dotColor = "bg-primary",
  placeholder = "Add a new item...",
}: {
  items: string[];
  onChange: (next: string[]) => void;
  dotColor?: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={i} className="group flex items-start gap-2 rounded-xl border border-transparent px-1 py-1 transition-colors hover:border-border hover:bg-muted/40">
          <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
          <textarea
            value={s}
            onChange={(e) => update(i, e.target.value)}
            rows={1}
            className="field-sizing-content w-full resize-none rounded-md bg-transparent px-1 py-1 text-sm leading-relaxed text-foreground/90 outline-none focus:bg-background focus:ring-1 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove item"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-dashed border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

export function CopyButton({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setDone(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setDone(false), 1500);
        } catch {
          toast.error("Could not copy");
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {done ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}
