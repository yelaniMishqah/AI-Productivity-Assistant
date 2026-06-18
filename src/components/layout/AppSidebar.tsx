import { Link, useRouterState } from "@tanstack/react-router";
import { Home, FileText, MessageSquare, Compass, Bot, Sparkles, ShieldAlert } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home, tint: "bg-gradient-hero" },
  { title: "Resume Analyzer", url: "/resume", icon: FileText, tint: "bg-gradient-sunset" },
  { title: "Interview Coach", url: "/interview", icon: MessageSquare, tint: "bg-gradient-ocean" },
  { title: "Career Planner", url: "/planner", icon: Compass, tint: "bg-gradient-mint" },
  { title: "AI Assistant", url: "/chat", icon: Bot, tint: "bg-gradient-amber" },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-hero shadow-soft">
            <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          {!collapsed && (
            <span className="font-display text-base font-bold tracking-tight">
              CareerBoost <span className="text-gradient">AI</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-foreground/80" />
            <p>
              <span className="font-semibold text-foreground">AI guidance only.</span> Review suggestions before acting on important decisions.
            </p>
          </div>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-warning/40 bg-warning/10" title="AI guidance only">
            <ShieldAlert className="h-4 w-4 text-warning-foreground/80" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
