import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouterState, Link } from "@tanstack/react-router";

const titles: Record<string, { title: string; sub: string }> = {
  "/": { title: "Dashboard", sub: "Your AI career workspace" },
  "/resume": { title: "Resume Analyzer", sub: "AI-powered resume review and ATS optimization" },
  "/interview": { title: "Interview Coach", sub: "Role-specific questions, sample answers, and tips" },
  "/planner": { title: "Career Planner", sub: "Personalized roadmaps, skills, and certifications" },
  "/chat": { title: "AI Assistant", sub: "Chat with your 24/7 career coach" },
};

export function TopBar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const match = Object.keys(titles)
    .filter((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0];
  const meta = titles[match] ?? { title: "CareerBoost AI", sub: "" };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-3 backdrop-blur-xl sm:px-5">
      <SidebarTrigger className="h-8 w-8" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-sm font-bold sm:text-base">{meta.title}</h1>
        {meta.sub && <p className="hidden truncate text-xs text-muted-foreground sm:block">{meta.sub}</p>}
      </div>
      <Link
        to="/chat"
        className="hidden shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elegant sm:inline-flex"
      >
        Open AI Assistant
      </Link>
    </header>
  );
}
