import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MessageSquare, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { generateInterviewPlan } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquare className="h-3.5 w-3.5" /> Interview Coach
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Practice with role-specific interview questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tell us the role and industry — we'll generate a mix of behavioral, technical, and situational questions with sample answers.
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
        <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate interview prep"}
          </button>
          <AIDisclaimer className="w-full sm:w-auto" />
        </div>
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
            <h2 className="font-display text-xl font-bold">Practice questions</h2>
            <div className="mt-4 space-y-4">
              {result.questions.map((q, i) => (
                <details key={i} className="group rounded-3xl border border-border bg-card p-5 shadow-soft open:shadow-elegant">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Q{i + 1} · {q.category}
                      </span>
                      <p className="mt-1 font-semibold">{q.question}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sample answer</h4>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{q.sampleAnswer}</p>
                    </div>
                    <div className="rounded-xl bg-accent/60 p-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-accent-foreground">
                        <Lightbulb className="h-3.5 w-3.5" /> Tip
                      </span>
                      <p className="mt-1 text-foreground/90">{q.tip}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-lg font-bold">Preparation tips</h2>
            <ul className="mt-4 space-y-3">
              {result.preparationTips.map((t, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
