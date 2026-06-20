import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FolderOpen, Trash2, Download, FileText, MessageSquare, Compass, Bot, StickyNote, Search, Pencil, Check, X } from "lucide-react";
import { listFiles, deleteFile, subscribeFiles, updateFile, type SavedFile } from "@/lib/files-store";
import { toast } from "sonner";

export const Route = createFileRoute("/files")({
  head: () => ({
    meta: [
      { title: "My Files — CareerBoost AI" },
      { name: "description", content: "All your saved AI outputs: resume reviews, interview prep, career plans, and chat answers." },
      { property: "og:title", content: "My Files — CareerBoost AI" },
      { property: "og:description", content: "Your saved AI outputs in one place." },
    ],
  }),
  component: FilesPage,
});

const sourceMeta: Record<SavedFile["source"], { label: string; icon: typeof FileText; tint: string }> = {
  chat: { label: "Chat", icon: Bot, tint: "bg-gradient-amber" },
  resume: { label: "Resume", icon: FileText, tint: "bg-gradient-sunset" },
  interview: { label: "Interview", icon: MessageSquare, tint: "bg-gradient-ocean" },
  planner: { label: "Planner", icon: Compass, tint: "bg-gradient-mint" },
  note: { label: "Note", icon: StickyNote, tint: "bg-gradient-hero" },
};

function FilesPage() {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    const refresh = () => setFiles(listFiles());
    refresh();
    return subscribeFiles(refresh);
  }, []);

  useEffect(() => {
    if (!selectedId && files.length > 0) setSelectedId(files[0].id);
    if (selectedId && !files.find((f) => f.id === selectedId)) {
      setSelectedId(files[0]?.id ?? null);
    }
  }, [files, selectedId]);

  const filtered = files.filter(
    (f) => !query || f.title.toLowerCase().includes(query.toLowerCase()) || f.content.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = files.find((f) => f.id === selectedId) ?? null;

  const handleDelete = (id: string) => {
    deleteFile(id);
    toast.success("File deleted");
  };

  const handleDownload = (f: SavedFile) => {
    const blob = new Blob([f.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${f.title.replace(/[^a-z0-9-_ ]/gi, "_") || "file"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditTitle = () => {
    if (!selected) return;
    setTitleDraft(selected.title);
    setEditingTitle(true);
  };

  const saveTitle = () => {
    if (!selected) return;
    updateFile(selected.id, { title: titleDraft.trim() || "Untitled" });
    setEditingTitle(false);
    toast.success("Title updated");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem-1px)] max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <header className="flex items-center gap-3 pb-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
          <FolderOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold">My Files</h1>
          <p className="truncate text-xs text-muted-foreground">
            {files.length} saved {files.length === 1 ? "item" : "items"}
          </p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        {/* List panel */}
        <aside className="flex min-h-0 flex-col rounded-3xl border border-border bg-card/40">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <li className="px-3 py-10 text-center text-xs text-muted-foreground">
                {files.length === 0 ? "No files yet. Save AI answers from the chat to keep them here." : "No matches."}
              </li>
            ) : (
              filtered.map((f) => {
                const meta = sourceMeta[f.source];
                const Icon = meta.icon;
                const active = f.id === selectedId;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => setSelectedId(f.id)}
                      className={`group flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition-colors ${active ? "bg-muted" : "hover:bg-muted/60"}`}
                    >
                      <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${meta.tint} text-white shadow-soft`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{f.title}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {meta.label} · {new Date(f.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        {/* Viewer panel */}
        <section className="flex min-h-0 flex-col rounded-3xl border border-border bg-card/40">
          {!selected ? (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div>
                <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium">No file selected</p>
                <p className="text-xs text-muted-foreground">
                  Save an AI response from the Chat page to start building your library.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-border p-3 sm:p-4">
                {editingTitle ? (
                  <>
                    <input
                      autoFocus
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTitle();
                        if (e.key === "Escape") setEditingTitle(false);
                      }}
                      className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={saveTitle} className="rounded-lg p-1.5 text-success hover:bg-muted" aria-label="Save title">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingTitle(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted" aria-label="Cancel">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="flex-1 truncate font-display text-base font-semibold">{selected.title}</h2>
                    <button onClick={startEditTitle} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Rename">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDownload(selected)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                <div className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none">
                  <ReactMarkdown>{selected.content}</ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
