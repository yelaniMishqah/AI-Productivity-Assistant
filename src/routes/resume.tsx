import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Sparkles, TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";
import { analyzeResume } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { EditableList, CopyButton } from "@/components/EditableList";
import { PromptStructure } from "@/components/PromptStructure";
import { toast } from "sonner";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume Analyzer — CareerBoost AI" },
      { name: "description", content: "Paste your resume and get an instant AI score, strengths, weaknesses, and ATS optimization tips." },
      { property: "og:title", content: "AI Resume Analyzer — CareerBoost AI" },
      { property: "og:description", content: "Get a free AI resume score with ATS optimization recommendations." },
    ],
  }),
  component: ResumePage,
});

type Result = Awaited<ReturnType<typeof analyzeResume>>;

function ResumePage() {
  const analyze = useServerFn(analyzeResume);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file, or paste your resume text below.");
      return;
    }
    const text = await file.text();
    setResumeText(text);
    toast.success("Resume loaded — review and click Analyze.");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim().length < 40) {
      toast.error("Please paste at least a few lines of your resume.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const out = await analyze({ data: { resumeText, targetRole } });
      setResult(out);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const patch = <K extends keyof Result>(key: K, value: Result[K]) =>
    setResult((prev) => (prev ? { ...prev, [key]: value } : prev));

  const buildReport = (r: Result) => `RESUME REVIEW${targetRole ? ` — ${targetRole}` : ""}
Score: ${r.score}/100

Summary
${r.summary}

Strengths
${r.strengths.map((x) => `- ${x}`).join("\n")}

Weaknesses
${r.weaknesses.map((x) => `- ${x}`).join("\n")}

Suggested improvements
${r.improvements.map((x) => `- ${x}`).join("\n")}

ATS optimization
${r.atsRecommendations.map((x) => `- ${x}`).join("\n")}

Missing keywords
${r.missingKeywords.join(", ")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        icon={FileText}
        eyebrow="Resume Analyzer"
        title="AI-powered resume review"
        desc="Paste your resume — optionally add a target role — and receive an ATS-friendly score with concrete improvements. All results are editable."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <label className="text-sm font-semibold">Target role (optional)</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Junior Software Engineer"
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-semibold">Your resume</label>
            <label className="cursor-pointer rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent">
              Upload .txt
              <input type="file" accept=".txt,text/plain" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here..."
            rows={14}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm leading-relaxed outline-none ring-ring focus:ring-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant disabled:opacity-60 sm:w-auto"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Analyzing your resume..." : "Analyze my resume"}
          </button>

          <div className="mt-5 space-y-3">
            <PromptStructure
              items={[
                { label: "Target role", desc: "Used to tailor keywords and ATS suggestions." },
                { label: "Resume text", desc: "Analyzed for structure, impact, and clarity." },
                { label: "Scoring", desc: "0–100 score reflecting overall quality and ATS readiness." },
                { label: "Output", desc: "Strengths, weaknesses, improvements, ATS tips, keywords." },
              ]}
            />
            <AIDisclaimer />
          </div>
        </form>

        <div className="space-y-4">
          {!result && !loading && (
            <div className="grid h-full place-items-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">Your editable analysis will appear here</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Fill in your resume on the left and click Analyze. Every result item is editable — tweak it before saving or copying.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid h-full place-items-center rounded-3xl border border-border bg-card p-10">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Crafting a thoughtful analysis...
              </div>
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-end">
                <CopyButton getText={() => buildReport(result)} label="Copy full report" />
              </div>

              <ScoreCard
                score={result.score}
                summary={result.summary}
                onSummaryChange={(v) => patch("summary", v)}
                onScoreChange={(v) => patch("score", v)}
              />

              <ListCard
                title="Strengths"
                icon={TrendingUp}
                tone="success"
                items={result.strengths}
                onChange={(v) => patch("strengths", v)}
              />
              <ListCard
                title="Weaknesses"
                icon={AlertCircle}
                tone="warning"
                items={result.weaknesses}
                onChange={(v) => patch("weaknesses", v)}
              />
              <ListCard
                title="Suggested improvements"
                icon={Lightbulb}
                tone="primary"
                items={result.improvements}
                onChange={(v) => patch("improvements", v)}
              />
              <ListCard
                title="ATS optimization"
                icon={Target}
                tone="primary"
                items={result.atsRecommendations}
                onChange={(v) => patch("atsRecommendations", v)}
              />

              <KeywordCard
                items={result.missingKeywords}
                onChange={(v) => patch("missingKeywords", v)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  score,
  summary,
  onSummaryChange,
  onScoreChange,
}: {
  score: number;
  summary: string;
  onSummaryChange: (v: string) => void;
  onScoreChange: (v: number) => void;
}) {
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
  const ring =
    tone === "success" ? "ring-success/40" : tone === "warning" ? "ring-warning/40" : "ring-destructive/40";
  const fg = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : "text-destructive";
  return (
    <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5">
        <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-full bg-card ring-4 ${ring}`}>
          <input
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => onScoreChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            className={`w-14 bg-transparent text-center font-display text-2xl font-extrabold outline-none ${fg}`}
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold">Resume Score</h3>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            rows={3}
            className="field-sizing-content mt-1 w-full resize-none rounded-md bg-transparent text-sm text-muted-foreground outline-none focus:bg-background focus:px-2 focus:py-1 focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  icon: Icon,
  tone,
  onChange,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "warning" | "primary";
  onChange: (next: string[]) => void;
}) {
  const dotColor =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <div className="mt-3">
        <EditableList items={items} onChange={onChange} dotColor={dotColor} placeholder={`Add to ${title.toLowerCase()}...`} />
      </div>
    </div>
  );
}

function KeywordCard({ items, onChange }: { items: string[]; onChange: (next: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <h3 className="font-display text-base font-bold">Missing keywords</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((k, i) => (
          <span key={`${k}-${i}`} className="group inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {k}
            <button
              type="button"
              aria-label={`Remove ${k}`}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-accent-foreground/60 hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = draft.trim();
            if (!v) return;
            onChange([...items, v]);
            setDraft("");
          }}
          className="flex items-center"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add keyword..."
            className="rounded-full border border-dashed border-border bg-transparent px-3 py-1 text-xs outline-none focus:border-primary"
          />
        </form>
      </div>
    </div>
  );
}

function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
        <Icon className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{desc}</p>
    </div>
  );
}
