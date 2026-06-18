import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Sparkles, TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";
import { analyzeResume } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        icon={FileText}
        eyebrow="Resume Analyzer"
        title="Get a smart, AI-powered resume review"
        desc="Paste your resume below — optionally add a target role — and receive an ATS-friendly score with concrete improvements."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft">
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
            rows={16}
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

          <AIDisclaimer className="mt-5" />
        </form>

        <div className="space-y-4">
          {!result && !loading && (
            <div className="grid h-full place-items-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">Your analysis will appear here</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Fill in your resume on the left and click Analyze. We'll score it and highlight what to improve.
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
              <ScoreCard score={result.score} summary={result.summary} />
              <ListCard title="Strengths" icon={TrendingUp} tone="success" items={result.strengths} />
              <ListCard title="Weaknesses" icon={AlertCircle} tone="warning" items={result.weaknesses} />
              <ListCard title="Suggested improvements" icon={Lightbulb} tone="primary" items={result.improvements} />
              <ListCard title="ATS optimization" icon={Target} tone="primary" items={result.atsRecommendations} />
              {result.missingKeywords.length > 0 && (
                <div className="rounded-3xl border border-border bg-card p-5">
                  <h3 className="font-display text-base font-bold">Missing keywords</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.missingKeywords.map((k) => (
                      <span key={k} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ score, summary }: { score: number; summary: string }) {
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
  const ring =
    tone === "success" ? "ring-success/40" : tone === "warning" ? "ring-warning/40" : "ring-destructive/40";
  const fg = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : "text-destructive";
  return (
    <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft">
      <div className="flex items-center gap-5">
        <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-full bg-card ring-4 ${ring}`}>
          <span className={`font-display text-2xl font-extrabold ${fg}`}>{score}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold">Resume Score</h3>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
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
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "warning" | "primary";
}) {
  if (!items?.length) return null;
  const dotColor =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
            <span className="text-foreground/90">{s}</span>
          </li>
        ))}
      </ul>
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
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{desc}</p>
    </div>
  );
}
