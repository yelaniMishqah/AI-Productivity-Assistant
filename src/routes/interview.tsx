import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MessageSquare, Loader2, Sparkles, Lightbulb, Trash2 } from "lucide-react";
import { generateInterviewPlan } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { EditableList, CopyButton } from "@/components/EditableList";
import { PromptStructure } from "@/components/PromptStructure";
import { toast } from "sonner";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "AI Interview Coach — CareerBoost AI" },
      { name: "description", content: "Generate role-specific interview questions, sample answers, and prep tips with AI." },
      { property: "og:title", content: "AI Interview Coach — CareerBoost AI" },
      { property: "og:description", content: "Practice tailored interview questions and prep tips." },
    ],
  }),
  component: InterviewPage,
});

type Result = Awaited<ReturnType<typeof generateInterviewPlan>>;
type QA = Result["questions"][number];

function InterviewPage() {
  const generate = useServerFn(generateInterviewPlan);
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState<"entry" | "mid" | "senior">("entry");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role.trim().length < 2) return toast.error("Tell us your target role.");
    setLoading(true);
    setResult(null);
    try {
      const out = await generate({ data: { role, industry, level } });
      setResult(out);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const patchQuestion = (i: number, key: keyof QA, value: string) => {
    if (!result) return;
    const next = [...result.questions];
    next[i] = { ...next[i], [key]: value };
    setResult({ ...result, questions: next });
  };
  const removeQuestion = (i: number) => {
    if (!result) return;
    setResult({ ...result, questions: result.questions.filter((_, idx) => idx !== i) });
  };

  const buildReport = (r: Result) =>
    `INTERVIEW PREP — ${role}${industry ? ` (${industry})` : ""} · ${level}\n\n` +
    r.questions
      .map((q, i) => `Q${i + 1} [${q.category}]: ${q.question}\n\nSample answer:\n${q.sampleAnswer}\n\nTip: ${q.tip}\n`)
      .join("\n---\n\n") +
    `\nPreparation tips:\n${r.preparationTips.map((t) => `- ${t}`).join("\n")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquare className="h-3.5 w-3.5" /> Interview Coach
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Practice with role-specific interview questions
        </h2>
        <p className="mt-3 text-muted-foreground">
          Tell us the role and industry — we'll generate a mix of behavioral, technical, and situational questions. Every answer and tip is editable.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-semibold">Target role *</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Product Manager"
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Industry</label>
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. SaaS, Fintech"
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Experience level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            >
              <option value="entry">Entry / new grad</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate interview prep"}
          </button>
          <PromptStructure
            items={[
              { label: "Role + industry", desc: "Shapes the depth and domain of questions." },
              { label: "Level", desc: "Adjusts complexity from entry to senior expectations." },
              { label: "Format", desc: "Mix of behavioral, technical, and situational." },
              { label: "Output", desc: "Question, sample STAR answer, and tip for each item." },
            ]}
          />
        </div>
        <AIDisclaimer className="mt-4" />
      </form>

      {loading && (
        <div className="mt-8 grid place-items-center rounded-3xl border border-border bg-card p-10">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Coaching session in progress...
          </div>
        </div>
      )}

      {result && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Practice questions</h3>
              <CopyButton getText={() => buildReport(result)} label="Copy report" />
            </div>
            <div className="space-y-4">
              {result.questions.map((q, i) => (
                <div key={i} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Q{i + 1}</span>
                        <input
                          value={q.category}
                          onChange={(e) => patchQuestion(i, "category", e.target.value)}
                          className="rounded-md bg-transparent px-1 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground outline-none focus:bg-muted focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <textarea
                        value={q.question}
                        onChange={(e) => patchQuestion(i, "question", e.target.value)}
                        rows={1}
                        className="field-sizing-content mt-1 w-full resize-none rounded-md bg-transparent px-1 py-1 font-semibold outline-none focus:bg-muted focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(i)}
                      aria-label="Remove question"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sample answer</h4>
                      <textarea
                        value={q.sampleAnswer}
                        onChange={(e) => patchQuestion(i, "sampleAnswer", e.target.value)}
                        rows={4}
                        className="field-sizing-content mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="rounded-xl bg-accent/60 p-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-accent-foreground">
                        <Lightbulb className="h-3.5 w-3.5" /> Tip
                      </span>
                      <textarea
                        value={q.tip}
                        onChange={(e) => patchQuestion(i, "tip", e.target.value)}
                        rows={2}
                        className="field-sizing-content mt-1 w-full resize-none rounded-md bg-transparent text-foreground/90 outline-none focus:bg-background focus:px-2 focus:py-1 focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft lg:sticky lg:top-20 lg:self-start">
            <h3 className="font-display text-lg font-bold">Preparation tips</h3>
            <div className="mt-4">
              <EditableList
                items={result.preparationTips}
                onChange={(v) => setResult({ ...result, preparationTips: v })}
                placeholder="Add a prep tip..."
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
