import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Workflow, ClipboardList, Warehouse, Route, Truck,
  Smartphone, MapPin, AlertTriangle, Users, BarChart3, Wallet, ShieldCheck,
  Settings2, Sparkles, Bell, Search, ChevronRight, Activity, Building2,
  HeadsetIcon, Database, Eye, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "@/contexts/ModeContext";

type NavItem = {
  to: string;
  label: string;
  icon: any;
  badge?: number | string;
  tone?: "destructive" | "warning";
  modeOnly?: "real" | "target";
};

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Visão geral",
    items: [
      { to: "/", label: "Torre de Controle", icon: LayoutDashboard, badge: "live" as any },
      { to: "/workflow", label: "Fluxo da entrega", icon: Workflow },
    ],
  },
  {
    group: "Cliente",
    items: [
      { to: "/portal-cliente", label: "Portal do Cliente", icon: Building2 },
    ],
  },
  {
    group: "Atendimento / Distribuição",
    items: [
      { to: "/intake", label: "Intake multicanal", icon: Inbox, badge: 8 },
      { to: "/normalizacao", label: "Normalização de dados", icon: Database, badge: 3, tone: "warning" },
      { to: "/mesa-analista", label: "Mesa do Analista", icon: HeadsetIcon, badge: 31, tone: "warning" },
      { to: "/orders", label: "Pedidos (carteira)", icon: ClipboardList, badge: 1284 },
      { to: "/routing", label: "Roteirização", icon: Route },
    ],
  },
  {
    group: "Armazém / Cross-dock",
    items: [
      { to: "/cross-docking", label: "Workspace Armazém", icon: Warehouse },
    ],
  },
  {
    group: "Transporte",
    items: [
      { to: "/app-motorista", label: "App do Motorista", icon: Smartphone },
      { to: "/tracking", label: "Rastreamento", icon: MapPin },
    ],
  },
  {
    group: "Monitoramento",
    items: [
      { to: "/occurrences", label: "Ocorrências", icon: AlertTriangle, badge: 23, tone: "destructive" },
    ],
  },
  {
    group: "Gestão",
    items: [
      { to: "/customers", label: "Clientes", icon: Users },
      { to: "/analytics", label: "Análises", icon: BarChart3, modeOnly: "target" },
      { to: "/financial", label: "Financeiro", icon: Wallet },
      { to: "/compliance", label: "Compliance", icon: ShieldCheck, badge: 4, tone: "warning" },
      { to: "/admin", label: "Admin", icon: Settings2 },
    ],
  },
];

export function AppShell({ children, onAiOpen }: { children: React.ReactNode; onAiOpen: () => void }) {
  const { pathname } = useLocation();
  const { mode, setMode } = useMode();
  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const current = allItems.find(n => n.to === pathname) ?? allItems[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-md bg-gradient-primary grid place-items-center shadow-glow">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground tracking-tight">Begur</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">OS de Entrega</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-2 space-y-3">
          {NAV_GROUPS.map(group => (
            <div key={group.group}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">{group.group}</div>
              <nav className="space-y-0.5">
                {group.items.filter(i => !i.modeOnly || i.modeOnly === mode).map(item => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-semibold tnum",
                          item.badge === "live"
                            ? "bg-success/15 text-success"
                            : item.tone === "destructive"
                            ? "bg-destructive/15 text-destructive"
                            : item.tone === "warning"
                            ? "bg-warning/15 text-warning"
                            : "bg-surface-3 text-muted-foreground"
                        )}>
                          {item.badge === "live" ? "● AO VIVO" : (item.badge as number).toLocaleString("pt-BR")}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={onAiOpen}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition",
              mode === "target"
                ? "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
                : "bg-surface-2 text-muted-foreground border border-dashed border-border cursor-not-allowed"
            )}
            disabled={mode === "real"}
            title={mode === "real" ? "Disponível apenas no modo Visão Alvo (precisa de dados padronizados)" : ""}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{mode === "target" ? "Begur Copilot" : "Copilot — bloqueado (Fase 3)"}</span>
            {mode === "target" && <kbd className="ml-auto bg-black/20 px-1 rounded text-[10px]">⌘K</kbd>}
          </button>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-info grid place-items-center text-[11px] font-bold text-primary-foreground">RM</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">Renata Moura</div>
              <div className="text-[10px] text-muted-foreground truncate">Gerente de Operações</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card/60 backdrop-blur flex items-center px-5 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Begur OS</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold">{current.label}</span>
          </div>

          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Buscar pedidos, NF, motoristas, clientes…"
              className="w-full bg-surface-2 border border-border rounded-md pl-9 pr-16 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-surface-3 px-1.5 py-0.5 rounded border border-border">⌘ /</kbd>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle modo */}
            <div className="flex items-center bg-surface-2 border border-border rounded-md p-0.5">
              <button
                onClick={() => setMode("real")}
                className={cn(
                  "px-2.5 h-7 rounded text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition",
                  mode === "real" ? "bg-warning/20 text-warning" : "text-muted-foreground hover:text-foreground"
                )}
                title="Operação real Begur hoje — híbrida, com papel e WhatsApp"
              >
                <Eye className="h-3 w-3" />
                Operação real
              </button>
              <button
                onClick={() => setMode("target")}
                className={cn(
                  "px-2.5 h-7 rounded text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition",
                  mode === "target" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                title="Visão alvo — para onde o sistema vai em 12 meses"
              >
                <Sparkles className="h-3 w-3" />
                Visão alvo
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-success/10 border border-success/30">
              <span className="relative h-1.5 w-1.5 inline-block">
                <span className="absolute inset-0 rounded-full bg-success pulse-dot text-success" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-[11px] font-semibold text-success uppercase tracking-wider">Sistemas online</span>
            </div>
            <button className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-accent">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>

        {/* Banner do modo */}
        {mode === "real" && (
          <div className="bg-warning/10 border-b border-warning/30 px-5 py-1.5 flex items-center gap-2 text-[11px]">
            <FileText className="h-3 w-3 text-warning" />
            <span className="text-warning font-semibold uppercase tracking-wider">Modo Operação Real</span>
            <span className="text-muted-foreground">Mostra a Begur de hoje: entradas fragmentadas, NF física, romaneio em papel, monitoramento por WhatsApp, planilhas paralelas. O sistema organiza esse caos.</span>
          </div>
        )}
        {mode === "target" && (
          <div className="bg-primary/10 border-b border-primary/30 px-5 py-1.5 flex items-center gap-2 text-[11px]">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider">Visão alvo (12 meses)</span>
            <span className="text-muted-foreground">Estado-alvo após Fases 1–3: dados padronizados, motorista no app, tracking por evento, copiloto operando sobre dado limpo.</span>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="bg-gradient-glow">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
