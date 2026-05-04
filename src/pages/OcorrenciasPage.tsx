import { OCCURRENCES_DATA, DELIVERIES } from "@/data/mock";
import { PageHeader, Btn } from "@/components/ui-kit";
import { AlertTriangle, CheckCircle2, Clock, Search, ChevronRight, MessageSquare, User, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  aberta: { label: "Aberta", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  em_analise: { label: "Em análise", cls: "bg-warning/10 text-warning border-warning/30" },
  resolvida: { label: "Resolvida", cls: "bg-success/10 text-success border-success/30" },
};

const SEVERITY_LABELS: Record<string, { label: string; cls: string }> = {
  high: { label: "Alta", cls: "text-destructive" },
  medium: { label: "Média", cls: "text-warning" },
  low: { label: "Baixa", cls: "text-muted-foreground" },
};

const TYPE_LABELS: Record<string, string> = {
  recusa: "Recusa", avaria: "Avaria", atraso: "Atraso", endereco: "Endereço", reentrega: "Reentrega", equipamento: "Equipamento",
};

export default function OcorrenciasPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = OCCURRENCES_DATA
    .filter(o => filter === "all" || o.status === filter)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase()));

  const selected = OCCURRENCES_DATA.find(o => o.id === selectedId);
  const selectedDelivery = selected ? DELIVERIES.find(d => d.id === selected.deliveryId) : null;

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Ocorrências"
        subtitle="Exceções e problemas que precisam de tratamento"
        actions={
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> {OCCURRENCES_DATA.filter(o => o.status === "aberta").length} abertas</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> {OCCURRENCES_DATA.filter(o => o.status === "em_analise").length} em análise</span>
          </div>
        }
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-0">
          {[
            { key: "all", label: "Todas", count: OCCURRENCES_DATA.length },
            { key: "aberta", label: "Abertas", count: OCCURRENCES_DATA.filter(o => o.status === "aberta").length },
            { key: "em_analise", label: "Em análise", count: OCCURRENCES_DATA.filter(o => o.status === "em_analise").length },
            { key: "resolvida", label: "Resolvidas", count: OCCURRENCES_DATA.filter(o => o.status === "resolvida").length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2.5 text-xs font-medium border-b-2 transition -mb-px",
                filter === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative max-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* List */}
        <div className={cn(selectedId ? "col-span-7" : "col-span-12")}>
          <div className="panel">
            <div className="divide-y divide-border">
              {filtered.map(o => {
                const sev = SEVERITY_LABELS[o.severity];
                const st = STATUS_LABELS[o.status];
                const isSelected = o.id === selectedId;
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedId(isSelected ? null : o.id)}
                    className={cn("w-full flex items-center gap-4 p-4 transition text-left",
                      isSelected ? "bg-primary/5" : "hover:bg-accent/30"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0",
                      o.status === "resolvida" ? "bg-success/10" : "bg-destructive/10"
                    )}>
                      {o.status === "resolvida" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{o.id}</span>
                        <span className="text-sm font-medium">{TYPE_LABELS[o.type] || o.type}</span>
                        <span className={cn("chip text-[10px]", st.cls)}>{st.label}</span>
                        <span className={cn("text-[10px] font-semibold", sev.cls)}>● {sev.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{o.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/entregas/${o.deliveryId}`); }}
                        className="text-xs text-primary hover:underline"
                      >{o.deliveryId}</button>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{o.opened}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end"><User className="h-2.5 w-2.5" />{o.owner}</div>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground shrink-0 transition", isSelected && "rotate-90")} />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-12 text-center text-sm text-muted-foreground">Nenhuma ocorrência encontrada.</div>
              )}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selected && selectedDelivery && (
          <div className="col-span-5 space-y-4 animate-slide-up">
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-primary" />{selected.id}</span>
                <span className={cn("chip text-[10px]", STATUS_LABELS[selected.status].cls)}>{STATUS_LABELS[selected.status].label}</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="stat-label">Tipo</div>
                  <div className="text-sm font-medium mt-0.5">{TYPE_LABELS[selected.type]}</div>
                </div>
                <div>
                  <div className="stat-label">Severidade</div>
                  <div className={cn("text-sm font-semibold mt-0.5", SEVERITY_LABELS[selected.severity].cls)}>
                    ● {SEVERITY_LABELS[selected.severity].label}
                  </div>
                </div>
                <div>
                  <div className="stat-label">Descrição</div>
                  <div className="text-sm mt-0.5">{selected.description}</div>
                </div>
                <div>
                  <div className="stat-label">Responsável</div>
                  <div className="text-sm mt-0.5 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />{selected.owner}</div>
                </div>
                <div>
                  <div className="stat-label">Entrega vinculada</div>
                  <button 
                    onClick={() => navigate(`/entregas/${selected.deliveryId}`)} 
                    className="text-sm text-primary hover:underline mt-0.5 flex items-center gap-1"
                  >
                    {selected.deliveryId} — {selectedDelivery.client} <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <div className="stat-label">Abertura</div>
                  <div className="text-sm mt-0.5 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{selected.opened}</div>
                </div>
              </div>
            </div>

            {/* Communication log */}
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Comunicação</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <div className="bg-surface-2 rounded-xl rounded-tl-md px-3 py-2">
                    <p className="text-xs">Motorista reportou: "{selected.description}"</p>
                    <span className="text-[10px] text-muted-foreground">{selected.opened}</span>
                  </div>
                </div>
                {selected.status !== "aberta" && (
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-lg bg-success/10 grid place-items-center shrink-0">
                      <User className="h-3 w-3 text-success" />
                    </div>
                    <div className="bg-surface-2 rounded-xl rounded-tl-md px-3 py-2">
                      <p className="text-xs">Analista assumiu o caso e está tratando.</p>
                      <span className="text-[10px] text-muted-foreground">há 5 min</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input placeholder="Adicionar comentário…" className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <Btn variant="primary" className="text-[11px] h-8"><MessageSquare className="h-3 w-3" /> Enviar</Btn>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {selected.status === "aberta" && (
                <Btn variant="primary" className="flex-1 justify-center">Assumir ocorrência</Btn>
              )}
              {selected.status === "em_analise" && (
                <>
                  <Btn variant="primary" className="flex-1 justify-center"><CheckCircle2 className="h-3.5 w-3.5" /> Resolver</Btn>
                  <Btn variant="outline" className="flex-1 justify-center">Escalar</Btn>
                </>
              )}
              {selected.status === "resolvida" && (
                <div className="flex-1 text-center text-xs text-success py-3">✓ Ocorrência resolvida</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
