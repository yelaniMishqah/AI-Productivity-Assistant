import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Compass, Loader2, Sparkles, GraduationCap, BookOpen, Trash2 } from "lucide-react";
import { buildCareerPlan } from "@/lib/career.functions";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { EditableList, CopyButton } from "@/components/EditableList";
import { PromptStructure } from "@/components/PromptStructure";
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

  const patch = <K extends keyof Result>(key: K, value: Result[K]) =>
    setResult((prev) => (prev ? { ...prev, [key]: value } : prev));

  const patchMilestone = (i: number, key: "title" | "timeframe" | "description", value: string) => {
    if (!result) return;
    const next = [...result.milestones];
    next[i] = { ...next[i], [key]: value };
    setResult({ ...result, milestones: next });
  };
  const removeMilestone = (i: number) =>
    result && setResult({ ...result, milestones: result.milestones.filter((_, idx) => idx !== i) });

  const patchCert = (i: number, key: "name" | "provider" | "why", value: string) => {
    if (!result) return;
    const next = [...result.certifications];
    next[i] = { ...next[i], [key]: value };
    setResult({ ...result, certifications: next });
  };
  const removeCert = (i: number) =>
    result && setResult({ ...result, certifications: result.certifications.filter((_, idx) => idx !== i) });

  const buildReport = (r: Result) =>
    `CAREER ROADMAP — ${targetRole}\n\nOverview\n${r.overview}\n\nMilestones\n` +
    r.milestones.map((m, i) => `${i + 1}. [${m.timeframe}] ${m.title}\n   ${m.description}`).join("\n") +
    `\n\nSkills to learn\n${r.skillsToLearn.map((s) => `- ${s}`).join("\n")}` +
    `\n\nCertifications\n${r.certifications.map((c) => `- ${c.name} (${c.provider}): ${c.why}`).join("\n")}` +
    `\n\nRecommended resources\n${r.recommendedResources.map((s) => `- ${s}`).join("\n")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
          <Compass className="h-3.5 w-3.5" /> Career Planner
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your personalized career roadmap
        </h2>
        <p className="mt-3 text-muted-foreground">
          Share where you are and where you want to go. The AI drafts a roadmap and you can edit every milestone, skill, and certification.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current role / status" value={currentRole} onChange={setCurrentRole} placeholder="e.g. Final-year CS student" />
          <Field label="Target role *" value={targetRole} onChange={setTargetRole} placeholder="e.g. Data Scientist" />
          <Field label="Years of experience" value={experience} onChange={setExperience} placeholder="e.g. 0-1" />
          <Field label="Interests / context" value={interests} onChange={setInterests} placeholder="e.g. AI/ML, remote, startups" />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Building your roadmap..." : "Build my roadmap"}
          </button>
          <PromptStructure
            items={[
              { label: "Current → target", desc: "Defines the gap the roadmap should close." },
              { label: "Experience", desc: "Calibrates pace and expected complexity." },
              { label: "Interests", desc: "Personalizes specializations and resources." },
              { label: "Output", desc: "12–24 month milestones, skills, certifications." },
            ]}
          />
        </div>
        <AIDisclaimer className="mt-4" />
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
          <div className="flex items-center justify-end">
            <CopyButton getText={() => buildReport(result)} label="Copy roadmap" />
          </div>

          <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft">
            <h3 className="font-display text-xl font-bold">Overview</h3>
            <textarea
              value={result.overview}
              onChange={(e) => patch("overview", e.target.value)}
              rows={3}
              className="field-sizing-content mt-2 w-full resize-none rounded-md bg-transparent leading-relaxed text-foreground/90 outline-none focus:bg-background focus:px-3 focus:py-2 focus:ring-1 focus:ring-ring"
            />
          </div>

          <section>
            <h3 className="font-display text-xl font-bold">Milestones</h3>
            <ol className="relative mt-5 space-y-5 border-l-2 border-border pl-6">
              {result.milestones.map((m, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                          <input
                            value={m.title}
                            onChange={(e) => patchMilestone(i, "title", e.target.value)}
                            className="min-w-0 rounded-md bg-transparent px-1 py-0.5 font-display font-bold outline-none focus:bg-muted focus:ring-1 focus:ring-ring"
                          />
                          <input
                            value={m.timeframe}
                            onChange={(e) => patchMilestone(i, "timeframe", e.target.value)}
                            className="w-32 rounded-md bg-transparent px-1 py-0.5 text-right text-xs font-semibold uppercase tracking-wider text-primary outline-none focus:bg-muted focus:ring-1 focus:ring-ring"
                          />
                        </div>
                        <textarea
                          value={m.description}
                          onChange={(e) => patchMilestone(i, "description", e.target.value)}
                          rows={2}
                          className="field-sizing-content mt-2 w-full resize-none rounded-md bg-transparent text-sm text-muted-foreground outline-none focus:bg-muted focus:px-2 focus:py-1 focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        aria-label="Remove milestone"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
              <div className="mt-3">
                <EditableList items={result.skillsToLearn} onChange={(v) => patch("skillsToLearn", v)} placeholder="Add a skill..." />
              </div>

              <h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended resources</h4>
              <div className="mt-2">
                <EditableList
                  items={result.recommendedResources}
                  onChange={(v) => patch("recommendedResources", v)}
                  placeholder="Add a resource..."
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-bold">Certifications & training</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {result.certifications.map((c, i) => (
                  <li key={i} className="rounded-2xl border border-border bg-muted/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <input
                        value={c.name}
                        onChange={(e) => patchCert(i, "name", e.target.value)}
                        className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 font-semibold outline-none focus:bg-background focus:ring-1 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => removeCert(i)}
                        aria-label="Remove certification"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      value={c.provider}
                      onChange={(e) => patchCert(i, "provider", e.target.value)}
                      className="mt-1 w-full rounded-md bg-transparent px-1 py-0.5 text-xs text-muted-foreground outline-none focus:bg-background focus:ring-1 focus:ring-ring"
                    />
                    <textarea
                      value={c.why}
                      onChange={(e) => patchCert(i, "why", e.target.value)}
                      rows={2}
                      className="field-sizing-content mt-1 w-full resize-none rounded-md bg-transparent px-1 py-0.5 text-sm text-foreground/90 outline-none focus:bg-background focus:ring-1 focus:ring-ring"
                    />
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
