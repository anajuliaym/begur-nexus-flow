import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELIVERIES, STAGE_META, DeliveryStage, TYPE_LABELS } from "@/data/mock";
import { PageHeader, StageBadge, SlaBadge, Btn, Filters } from "@/components/ui-kit";
import { Plus, Search, ChevronRight, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGE_TABS: { key: DeliveryStage | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "solicitacao", label: "Solicitação" },
  { key: "crossdocking", label: "Cross-Docking" },
  { key: "preparacao", label: "Preparação" },
  { key: "execucao", label: "Em execução" },
  { key: "concluida", label: "Concluída" },
];

export default function Entregas() {
  const [activeStage, setActiveStage] = useState<DeliveryStage | "all">("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = DELIVERIES
    .filter(d => activeStage === "all" || d.stage === activeStage)
    .filter(d => !search || d.id.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Entregas"
        subtitle="Gerencie todas as entregas do seu portfólio"
        actions={<Btn variant="primary"><Plus className="h-3.5 w-3.5"/> Nova entrega</Btn>}
      />

      {/* Stage tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-0">
        {STAGE_TABS.map(tab => {
          const count = tab.key === "all" ? DELIVERIES.length : DELIVERIES.filter(d => d.stage === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStage(tab.key)}
              className={cn(
                "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px",
                activeStage === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label} <span className="ml-1 text-[10px] tnum">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por ID ou cliente…"
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* List */}
      <div className="panel">
        <div className="divide-y divide-border">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => navigate(`/entregas/${d.id}`)}
              className="w-full flex items-center gap-4 p-4 hover:bg-accent/40 transition text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                  <span className="text-sm font-medium">{d.client}</span>
                  <span className="chip text-[10px] bg-surface-2 border-border text-muted-foreground">{TYPE_LABELS[d.type]}</span>
                  <StageBadge stage={d.stage} />
                  <SlaBadge sla={d.slaStatus} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{d.destination}</p>
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <div className="text-xs text-muted-foreground">{d.created}</div>
                {d.driver && <div className="text-xs flex items-center gap-1 text-foreground justify-end"><User className="h-3 w-3"/>{d.driver}</div>}
                {d.eta && <div className="text-xs text-primary font-medium">ETA {d.eta}</div>}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">Nenhuma entrega encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
