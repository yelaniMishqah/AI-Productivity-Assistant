// Lightweight localStorage-backed "files" store for AI outputs.
// Each file is a piece of generated content the user chose to keep.

export type SavedFile = {
  id: string;
  title: string;
  source: "chat" | "resume" | "interview" | "planner" | "note";
  content: string;
  createdAt: number;
};

const KEY = "careerboost-files-v1";

function read(): SavedFile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedFile[]) : [];
  } catch {
    return [];
  }
}

function write(files: SavedFile[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(files));
    window.dispatchEvent(new CustomEvent("careerboost-files-change"));
  } catch {
    /* ignore quota */
  }
}

export function listFiles(): SavedFile[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveFile(input: Omit<SavedFile, "id" | "createdAt">): SavedFile {
  const file: SavedFile = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  const files = read();
  files.push(file);
  write(files);
  return file;
}

export function deleteFile(id: string) {
  write(read().filter((f) => f.id !== id));
}

export function updateFile(id: string, patch: Partial<Pick<SavedFile, "title" | "content">>) {
  write(read().map((f) => (f.id === id ? { ...f, ...patch } : f)));
}

export function clearFiles() {
  write([]);
}

export function subscribeFiles(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("careerboost-files-change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("careerboost-files-change", handler);
    window.removeEventListener("storage", handler);
  };
}
