import { NavLink, useLocation } from "react-router-dom";
import { Briefcase, Package, AlertTriangle, BarChart3, Bell, Search, ChevronRight, Activity, Inbox, Sparkles, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const NAV = [
  { to: "/", label: "Operação", icon: Briefcase, description: "Mesa do Analista" },
  { to: "/solicitacoes", label: "Solicitações", icon: Inbox, badge: 5 },
  { to: "/entregas", label: "Entregas", icon: Package, badge: 32 },
  { to: "/ocorrencias", label: "Ocorrências", icon: AlertTriangle, badge: 8, tone: "destructive" as const },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

const EXTERNAL_VIEWS = [
  { to: "/entregador", label: "App Entregador", icon: Smartphone },
  { to: "/portal", label: "Portal Cliente", icon: Globe },
];

export function AppShell({ children, onAiOpen }: { children: React.ReactNode; onAiOpen: () => void }) {
  const { pathname } = useLocation();
  const current = NAV.find(n => pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to))) ?? NAV[0];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onAiOpen();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onAiOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Activity className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white tracking-tight">Begur</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground">Control Tower</span>
          </div>
        </div>

        <div className="px-3 pt-5 flex-1 flex flex-col">
          <nav className="space-y-1">
            {NAV.map(item => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                    active
                      ? "bg-sidebar-primary/15 text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-white")} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-lg font-semibold tnum",
                      item.tone === "destructive"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-sidebar-accent text-sidebar-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Separator */}
          <div className="mt-5 mb-3 px-3">
            <div className="h-px bg-sidebar-border" />
            <span className="text-[9px] uppercase tracking-widest text-sidebar-foreground/50 mt-3 block">Visualizações</span>
          </div>
          <nav className="space-y-1">
            {EXTERNAL_VIEWS.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-white transition"
                >
                  <Icon className="h-4 w-4 shrink-0 text-sidebar-foreground/50 group-hover:text-white" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Copilot button */}
          <div className="px-0 pb-3">
            <button
              onClick={onAiOpen}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-primary/15 hover:text-white transition group"
            >
              <Sparkles className="h-4.5 w-4.5 shrink-0 text-sidebar-primary group-hover:text-sidebar-primary" />
              <span className="flex-1 text-left">Begur Copilot</span>
              <kbd className="text-[9px] px-1.5 py-0.5 rounded-md bg-sidebar-accent/50 text-sidebar-foreground/60 font-mono">⌘K</kbd>
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent/60 cursor-pointer">
            <div className="h-8 w-8 rounded-xl bg-gradient-primary grid place-items-center text-[11px] font-bold text-primary-foreground">RM</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Renata Moura</div>
              <div className="text-[10px] text-sidebar-foreground truncate">Analista Sênior</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{current.label}</span>
            {current.description && <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{current.description}</span>
            </>}
          </div>
          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar entregas, clientes, motoristas…"
              className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
            />
          </div>
          <button className="relative h-9 w-9 grid place-items-center rounded-xl hover:bg-accent transition">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
