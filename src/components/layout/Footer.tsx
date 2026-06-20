import { Link } from "@tanstack/react-router";
import { ShieldAlert, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold">
                CareerBoost <span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-powered career tools for students, graduates, and job seekers — built to help you stand out.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Tools</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/resume" className="hover:text-foreground">Resume Analyzer</Link></li>
              <li><Link to="/interview" className="hover:text-foreground">Interview Coach</Link></li>
              <li><Link to="/planner" className="hover:text-foreground">Career Planner</Link></li>
              <li><Link to="/chat" className="hover:text-foreground">AI Assistant</Link></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning-foreground/80" />
              <h4 className="text-sm font-semibold">Responsible AI</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              AI-generated recommendations are for guidance only. Please review them carefully and consult mentors,
              advisors, or trusted professionals before making important career decisions.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CareerBoost AI. Built by <a href="https://athulemishqahyelani-pulse-pro.base44.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Athule Mishqah Yelani</a>.</p>
          <p>Made with care for your career journey.</p>
        </div>
      </div>
    </footer>
  );
}
