import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Compass, Loader2, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import { buildCareerPlan } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Career Planner — CareerBoost AI" },
      { name: "description", content: "Build a personalized AI career roadmap with milestones, skills, and certifications." },
      { property: "og:title", content: "AI Career Planner — CareerBoost AI" },
      { property: "og:description", content: "Personalized career roadmap with milestones and recommended certifications." },
    ],
  }),
  component: PlannerPage,
});

type Result = Awaited<ReturnType<typeof buildCareerPlan>>;

function PlannerPage() {
  const build = useServerFn(buildCareerPlan);
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRole.trim().length < 2) return toast.error("Tell us your target role.");
    setLoading(true);
    setResult(null);
    try {
      const out = await build({ data: { currentRole, targetRole, experience, interests } });
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
          <Compass className="h-3.5 w-3.5" /> Career Planner
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your personalized career roadmap
        </h1>
        <p className="mt-3 text-muted-foreground">
          Share where you are and where you want to go — we'll outline milestones, key skills, and certifications to get you there.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current role / status" value={currentRole} onChange={setCurrentRole} placeholder="e.g. Final-year CS student" />
          <Field label="Target role *" value={targetRole} onChange={setTargetRole} placeholder="e.g. Data Scientist" />
          <Field label="Years of experience" value={experience} onChange={setExperience} placeholder="e.g. 0-1" />
          <Field label="Interests / context" value={interests} onChange={setInterests} placeholder="e.g. AI/ML, remote, startups" />
        </div>
        <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Building your roadmap..." : "Build my roadmap"}
          </button>
          <AIDisclaimer className="w-full sm:w-auto" />
        </div>
      </form>

      {loading && (
        <div className="mt-8 grid place-items-center rounded-3xl border border-border bg-card p-10">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Drafting your roadmap...
          </div>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-8">
          <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold">Overview</h2>
            <p className="mt-2 leading-relaxed text-foreground/90">{result.overview}</p>
          </div>

          <section>
            <h2 className="font-display text-xl font-bold">Milestones</h2>
            <ol className="relative mt-5 space-y-5 border-l-2 border-border pl-6">
              {result.milestones.map((m, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display font-bold">{m.title}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{m.timeframe}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-bold">Skills to learn</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.skillsToLearn.map((s) => (
                  <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    {s}
                  </span>
                ))}
              </div>
              {result.recommendedResources.length > 0 && (
                <>
                  <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended resources</h4>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {result.recommendedResources.map((r, i) => (
                      <li key={i} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {r}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-bold">Certifications & training</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {result.certifications.map((c, i) => (
                  <li key={i} className="rounded-2xl border border-border bg-muted/40 p-3">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.provider}</p>
                    <p className="mt-1 text-sm text-foreground/90">{c.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
      />
    </div>
  );
}
