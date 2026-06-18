import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MessageSquare, Compass, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { AIDisclaimer } from "@/components/AIDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerBoost AI — Your AI Career Coach" },
      { name: "description", content: "AI-powered resume analyzer, interview coach, career planner, and assistant. Free tools for students and job seekers." },
      { property: "og:title", content: "CareerBoost AI — Your AI Career Coach" },
      { property: "og:description", content: "AI-powered resume analyzer, interview coach, career planner, and assistant." },
    ],
  }),
  component: HomePage,
});

const features = [
  { to: "/resume", icon: FileText, title: "Resume Analyzer", desc: "Get an instant score, strengths, weaknesses, and ATS-ready suggestions for your resume.", color: "from-indigo-500/15 to-blue-500/10" },
  { to: "/interview", icon: MessageSquare, title: "AI Interview Coach", desc: "Practice tailored questions by role and industry with sample answers and prep tips.", color: "from-teal-500/15 to-cyan-500/10" },
  { to: "/planner", icon: Compass, title: "Career Planner", desc: "Build a personalized roadmap with milestones, skills, and certifications.", color: "from-violet-500/15 to-fuchsia-500/10" },
  { to: "/chat", icon: Bot, title: "AI Career Assistant", desc: "Chat 24/7 about job search, career growth, and learning resources.", color: "from-amber-500/15 to-orange-500/10" },
] as const;

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
        <div
          aria-hidden
          className="absolute inset-x-0 -top-32 -z-10 h-[480px] opacity-50 blur-3xl"
          style={{ background: "radial-gradient(60% 60% at 50% 40%, oklch(0.72 0.16 200 / .35), transparent 70%)" }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered career coaching
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Boost your career with{" "}
              <span className="text-gradient">your own AI coach</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Analyze your resume, ace your interviews, plan your next move, and get instant guidance — all in one
              friendly, AI-powered workspace built for students, graduates, and job seekers.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
              >
                Analyze my resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Talk to the AI assistant
              </Link>
            </div>
            <ul className="mt-7 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {["100% free to try", "No signup required", "Built for students & grads", "Responsible AI guidance"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-hero opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="Abstract illustration of an upward arrow growing from a neural-circuit base"
              width={1536}
              height={1024}
              className="aspect-[3/2] w-full rounded-3xl border border-border object-cover shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to land the role</h2>
          <p className="mt-3 text-muted-foreground">Four AI tools designed to work together across your entire career journey.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map(({ to, icon: Icon, title, desc, color }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant`}
            >
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${color} blur-2xl`} />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-border bg-gradient-card p-8 sm:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Share your context", d: "Paste your resume, target role, or current situation." },
              { n: "2", t: "Get AI insights", d: "Receive a tailored analysis, plan, or interview prep in seconds." },
              { n: "3", t: "Take confident action", d: "Apply, practice, and grow with clear next steps." },
            ].map((s) => (
              <div key={s.n}>
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <AIDisclaimer className="mt-8" />
        </div>
      </section>
    </div>
  );
}
