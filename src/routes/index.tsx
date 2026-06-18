import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MessageSquare, Compass, Bot, Sparkles, CheckCircle2, Target, GraduationCap, Rocket } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { AIDisclaimer } from "@/components/AIDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareerBoost AI" },
      { name: "description", content: "Your AI career workspace: resume review, interview prep, planning, and an AI assistant in one dashboard." },
      { property: "og:title", content: "CareerBoost AI — Dashboard" },
      { property: "og:description", content: "AI tools to land your next role: resume, interviews, career planning, assistant." },
    ],
  }),
  component: DashboardPage,
});

const tools = [
  {
    to: "/resume",
    icon: FileText,
    title: "Resume Analyzer",
    desc: "Score your resume, fix weaknesses, optimize for ATS.",
    cta: "Analyze a resume",
    gradient: "bg-gradient-sunset",
    glow: "from-fuchsia-500/40 via-pink-500/30 to-orange-400/30",
  },
  {
    to: "/interview",
    icon: MessageSquare,
    title: "Interview Coach",
    desc: "Tailored questions, sample answers, and prep tips.",
    cta: "Start a practice session",
    gradient: "bg-gradient-ocean",
    glow: "from-cyan-400/40 via-sky-500/30 to-teal-400/30",
  },
  {
    to: "/planner",
    icon: Compass,
    title: "Career Planner",
    desc: "Personalized roadmap with milestones and skills.",
    cta: "Build a roadmap",
    gradient: "bg-gradient-mint",
    glow: "from-emerald-400/40 via-lime-400/30 to-teal-400/30",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Assistant",
    desc: "Chat 24/7 about jobs, growth, and learning.",
    cta: "Open assistant",
    gradient: "bg-gradient-amber",
    glow: "from-amber-400/40 via-orange-400/30 to-rose-400/30",
  },
] as const;

const stats = [
  { label: "AI tools", value: "4", icon: Sparkles, tint: "bg-gradient-sunset" },
  { label: "Avg. minutes per session", value: "~3", icon: Rocket, tint: "bg-gradient-ocean" },
  { label: "Editable outputs", value: "100%", icon: Target, tint: "bg-gradient-mint" },
  { label: "Free to use", value: "Yes", icon: GraduationCap, tint: "bg-gradient-amber" },
] as const;

function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Your AI career workspace
            </span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back — let's <span className="text-gradient">boost your career</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Pick a tool to get started. Every AI suggestion is editable — refine, save, and copy it before sharing.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant"
              >
                Analyze my resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Chat with AI
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-hero opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="Abstract growth illustration"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${s.tint} opacity-30 blur-2xl`} />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <span className={`grid h-7 w-7 place-items-center rounded-lg ${s.tint} text-white shadow-soft`}>
                <s.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="relative mt-2 font-display text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Tools grid */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="font-display text-xl font-bold">Your tools</h3>
            <p className="text-sm text-muted-foreground">Four AI workflows built for students, graduates, and job seekers.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, desc, cta, gradient, glow }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${glow} blur-2xl`} />
              <div className={`absolute -left-10 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-tr ${glow} opacity-60 blur-2xl`} />
              <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${gradient} text-white shadow-elegant ring-1 ring-white/30`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-base font-bold">{title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    {cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-lg font-bold">How it works</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            { n: "1", t: "Share your context", d: "Paste your resume, target role, or current situation." },
            { n: "2", t: "Get AI insights", d: "Receive a tailored analysis, plan, or interview prep in seconds." },
            { n: "3", t: "Edit & take action", d: "Tweak every AI suggestion to match your voice and apply." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-muted/40 p-4">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <h4 className="mt-3 font-display font-bold">{s.t}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {["100% free to try", "No signup required", "Edit every AI output", "Responsible AI guidance"].map((x) => (
            <li key={x} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> {x}
            </li>
          ))}
        </ul>
        <AIDisclaimer className="mt-6" />
      </section>
    </div>
  );
}
