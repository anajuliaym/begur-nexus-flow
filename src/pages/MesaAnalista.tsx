import { PageHeader, Btn, StatusBadge, SlaBadge } from "@/components/ui-kit";
import { ORDERS, STATUS_META } from "@/data/mock";
import { Inbox, ClipboardList, AlertTriangle, CheckCheck, Phone, MessageCircle, FileText, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TABS = [
  { id: "fila",       label: "Fila de triagem",       icon: Inbox,         filter: (o: any) => ["intake_received","intake_normalizing","triage_pending"].includes(o.status) },
  { id: "minha",      label: "Minha carteira",        icon: ClipboardList, filter: (o: any) => ["os_issued","awaiting_picking","awaiting_routing"].includes(o.status) },
  { id: "travados",   label: "Pedidos travados",      icon: AlertTriangle, filter: (o: any) => o.sla === "breached" || o.sla === "at_risk" },
  { id: "aprovacoes", label: "Aprovações pendentes",  icon: CheckCheck,    filter: (o: any) => o.awaitingHandoffTo },
];

export default function MesaAnalista() {
  const [tab, setTab] = useState("fila");
  const filter = TABS.find(t => t.id === tab)!.filter;
  const list = ORDERS.filter(filter);

  return (
    <div className="p-5 space-y-4">
      <PageHeader
        title="Mesa do Analista"
        subtitle="Cockpit operacional — não é dashboard. É onde o analista de atendimento/distribuição opera o dia."
        actions={<>
          <Btn><Phone className="h-3 w-3" /> Ligar para cliente</Btn>
          <Btn><MessageCircle className="h-3 w-3" /> Abrir chat WhatsApp</Btn>
          <Btn variant="primary"><FileText className="h-3 w-3" /> Emitir OS</Btn>
        </>}
      />

      {/* Identidade do analista + carga */}
      <div className="panel p-4 flex items-center gap-4 card-interactive animate-fade-in-up">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-info grid place-items-center text-sm font-bold text-primary-foreground animate-pulse-glow hover-scale cursor-pointer">AS</div>
        <div className="flex-1 animate-fade-in-left" style={{ animationDelay: '100ms' }}>
          <div className="text-sm font-semibold">Amanda Santos · Analista de Atendimento</div>
          <div className="text-[11px] text-muted-foreground">Carteira: Heineken, Bacio, Solar · Turno 06h-14h</div>
        </div>
        <div className="flex gap-6 stagger-children">
          <div className="text-center"><div className="text-xl font-bold tnum text-warning number-animate">12</div><div className="text-[10px] text-muted-foreground">na minha fila</div></div>
          <div className="text-center"><div className="text-xl font-bold tnum text-destructive number-animate badge-pulse">3</div><div className="text-[10px] text-muted-foreground">SLA estourado</div></div>
          <div className="text-center"><div className="text-xl font-bold tnum text-success number-animate">38</div><div className="text-[10px] text-muted-foreground">resolvidos hoje</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        {TABS.map((t, i) => {
          const Icon = t.icon;
          const count = ORDERS.filter(t.filter).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-3 h-9 text-xs font-medium flex items-center gap-1.5 border-b-2 -mb-px transition-all duration-300 btn-press",
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Icon className={cn("h-3.5 w-3.5 transition-all duration-300", tab === t.id && "scale-110")} />
              {t.label}
              <span className={cn(
                "tnum text-[10px] bg-surface-2 px-1.5 rounded transition-all duration-300",
                tab === t.id && "bg-primary/20 text-primary"
              )}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Lista densa */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold">{TABS.find(t => t.id === tab)!.label}</div>
          <div className="flex gap-2">
            <Btn><Filter className="h-3 w-3" /> Filtrar</Btn>
            <Btn>Reatribuir</Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium w-10"><input type="checkbox" /></th>
                <th className="text-left px-3 py-2 font-medium">Pedido</th>
                <th className="text-left px-3 py-2 font-medium">Cliente</th>
                <th className="text-left px-3 py-2 font-medium">Carga</th>
                <th className="text-left px-3 py-2 font-medium">Destino</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-left px-3 py-2 font-medium">Etapa</th>
                <th className="text-left px-3 py-2 font-medium">Aguarda</th>
                <th className="text-left px-3 py-2 font-medium">SLA</th>
                <th className="text-left px-3 py-2 font-medium">Canal</th>
                <th className="text-right px-3 py-2 font-medium">Há</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.slice(0, 18).map((o, i) => (
                <tr 
                  key={o.id} 
                  className="row-animate animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-3 py-2"><input type="checkbox" className="accent-primary" /></td>
                  <td className="px-3 py-2 font-mono text-xs text-primary">{o.id}</td>
                  <td className="px-3 py-2 font-medium text-xs">{o.client}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground truncate max-w-[200px]" title={o.cargo}>
                    {o.qty} {o.unit} · {o.cargo}
                    {o.serialRequired && <span className="ml-1 chip bg-warning/10 text-warning border-warning/30 text-[9px] animate-pulse">SN</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground truncate max-w-[180px]">{o.destination}</td>
                  <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                  <td className="px-3 py-2 text-[10px] text-muted-foreground">{STATUS_META[o.status].stage}</td>
                  <td className="px-3 py-2 text-[10px] text-muted-foreground truncate max-w-[140px]">{o.awaitingHandoffTo ?? o.owner}</td>
                  <td className="px-3 py-2"><SlaBadge sla={o.sla} /></td>
                  <td className="px-3 py-2 text-[10px] text-muted-foreground">{o.channel}{o.hasPhysicalDoc && <span className="ml-1 text-warning animate-pulse">📄</span>}</td>
                  <td className="px-3 py-2 text-right text-[11px] text-muted-foreground tnum">{o.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
