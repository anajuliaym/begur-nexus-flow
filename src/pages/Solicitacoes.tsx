import { useState } from "react";
import {
  SERVICE_REQUESTS,
  CHANNEL_META,
  REQUEST_STATUS_META,
  ServiceRequest,
  RequestChannel,
  RequestStatus,
  TYPE_LABELS,
  DeliveryType,
} from "@/data/mock";
import { PageHeader, Btn } from "@/components/ui-kit";
import {
  Mail,
  MessageCircle,
  Globe,
  PenLine,
  ChevronRight,
  ArrowLeft,
  Clock,
  MapPin,
  Package,
  User,
  Plus,
  X,
  CheckCircle2,
  Send,
  Sparkles,
  Brain,
  Eye,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<RequestChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  api: Globe,
  manual: PenLine,
};

// Simulated AI extraction results per request
const AI_EXTRACTIONS: Record<string, {
  confidence: number;
  status: "auto" | "revisado" | "pendente";
  fields: { label: string; value: string; confidence: number; edited?: boolean }[];
  suggestions: string[];
}> = {
  "SOL-0001": {
    confidence: 94,
    status: "auto",
    fields: [
      { label: "Cliente", value: "Heineken", confidence: 99 },
      { label: "Tipo", value: "Coleta", confidence: 96 },
      { label: "Produto", value: "Cerveja Heineken 600ml (cx 12un)", confidence: 98 },
      { label: "Quantidade", value: "120 caixas", confidence: 97 },
      { label: "Local de coleta", value: "CD Jacareí — Rod. Presidente Dutra, km 160", confidence: 92 },
      { label: "Janela", value: "08:00 às 12:00", confidence: 95 },
      { label: "Destino", value: "CD Begur Barueri", confidence: 99 },
      { label: "Contato", value: "Fernando Alves (11) 99887-2233", confidence: 88 },
    ],
    suggestions: ["Verificar disponibilidade de veículo refrigerado", "Confirmar janela de coleta com CD Jacareí"],
  },
  "SOL-0002": {
    confidence: 87,
    status: "pendente",
    fields: [
      { label: "Cliente", value: "Bacio di Latte", confidence: 99 },
      { label: "Tipo", value: "Entrega", confidence: 92 },
      { label: "Produto 1", value: "Gelato sortido 500ml", confidence: 85 },
      { label: "Quantidade 1", value: "30 caixas", confidence: 90 },
      { label: "Produto 2", value: "Picolé premium", confidence: 78, edited: false },
      { label: "Quantidade 2", value: "15 caixas", confidence: 88 },
      { label: "Destino", value: "Rua Oscar Freire, 890 — Jardins/SP", confidence: 95 },
      { label: "Prazo", value: "Amanhã até 10h", confidence: 82 },
    ],
    suggestions: ["Confirmar sabores do picolé premium", "Verificar temperatura: -18°C (congelado)"],
  },
  "SOL-0003": {
    confidence: 96,
    status: "revisado",
    fields: [
      { label: "Cliente", value: "Seara", confidence: 99 },
      { label: "Tipo", value: "Entrega", confidence: 98 },
      { label: "Produto", value: "Empanado Seara 400g", confidence: 99 },
      { label: "Quantidade", value: "200 caixas", confidence: 99 },
      { label: "Temperatura", value: "-18°C (congelado)", confidence: 97 },
      { label: "Destino", value: "5 pontos na Grande SP", confidence: 94 },
      { label: "Data", value: "06/05/2026", confidence: 96 },
      { label: "Pedido", value: "PED-88431", confidence: 99 },
    ],
    suggestions: ["Verificar 5 veículos refrigerados disponíveis"],
  },
  "SOL-0004": {
    confidence: 98,
    status: "revisado",
    fields: [
      { label: "Cliente", value: "Nestlé", confidence: 99 },
      { label: "Tipo", value: "Remessa (Transferência)", confidence: 97 },
      { label: "Produto", value: "Nescafé Dolce Gusto cx", confidence: 99 },
      { label: "Quantidade", value: "80 caixas", confidence: 99 },
      { label: "NF", value: "44521", confidence: 99 },
      { label: "Peso", value: "960kg", confidence: 98 },
      { label: "Pallets", value: "4", confidence: 97 },
    ],
    suggestions: [],
  },
  "SOL-0005": {
    confidence: 99,
    status: "auto",
    fields: [
      { label: "Cliente", value: "Natural One", confidence: 99 },
      { label: "Tipo", value: "Entrega", confidence: 99 },
      { label: "Produto", value: "Suco Natural One 900ml (3 sabores)", confidence: 99 },
      { label: "Quantidade", value: "150 caixas (50/sabor)", confidence: 99 },
      { label: "Destino", value: "CD Atacadão Interlagos", confidence: 99 },
      { label: "Temperatura", value: "Refrigerado (2-8°C)", confidence: 99 },
      { label: "Prazo", value: "D+2", confidence: 99 },
    ],
    suggestions: [],
  },
  "SOL-0006": {
    confidence: 89,
    status: "pendente",
    fields: [
      { label: "Cliente", value: "Metalfrio T1", confidence: 99 },
      { label: "Tipo", value: "Entrega + Instalação", confidence: 84 },
      { label: "Produto", value: "Freezer Metalfrio VF55", confidence: 96 },
      { label: "Quantidade", value: "1 unidade", confidence: 92 },
      { label: "Destino", value: "Av. Norte Sul, 1200 — Campinas/SP", confidence: 95 },
      { label: "Observação", value: "Precisa 2 ajudantes para descarga", confidence: 86 },
      { label: "Prazo", value: "Até sexta-feira", confidence: 78 },
    ],
    suggestions: ["Confirmar data exata (qual sexta?)", "Verificar equipe de instalação disponível"],
  },
  "SOL-0007": {
    confidence: 91,
    status: "auto",
    fields: [
      { label: "Cliente", value: "Solar", confidence: 99 },
      { label: "Tipo", value: "Cotação comercial", confidence: 88 },
      { label: "Rota", value: "Fortaleza/CE → Teresina/PI", confidence: 96 },
      { label: "Volume", value: "3 carretas/semana", confidence: 94 },
      { label: "Temperatura", value: "Ambiente", confidence: 92 },
    ],
    suggestions: ["Não é uma solicitação operacional — encaminhar ao comercial"],
  },
  "SOL-0008": {
    confidence: 100,
    status: "revisado",
    fields: [
      { label: "Cliente", value: "Froneri", confidence: 100 },
      { label: "Tipo", value: "Reentrega", confidence: 100 },
      { label: "Produto", value: "Sorvete Froneri 2L", confidence: 100 },
      { label: "Quantidade", value: "45 caixas", confidence: 100 },
      { label: "Destino", value: "Pão de Açúcar Moema — São Paulo/SP", confidence: 100 },
      { label: "Temperatura", value: "-18°C (congelado)", confidence: 100 },
      { label: "Prazo", value: "Mesmo dia", confidence: 100 },
    ],
    suggestions: [],
  },
};

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 95 ? "text-success" : value >= 85 ? "text-warning" : "text-destructive";
  const bg = value >= 95 ? "bg-success/10 border-success/30" : value >= 85 ? "bg-warning/10 border-warning/30" : "bg-destructive/10 border-destructive/30";
  return (
    <span className={cn("chip text-[10px] tnum", bg, color)}>
      {value}%
    </span>
  );
}

function AiStatusBadge({ status }: { status: "auto" | "revisado" | "pendente" }) {
  const map = {
    auto: { label: "Extração automática", cls: "bg-primary/10 text-primary border-primary/30" },
    revisado: { label: "Revisado ✓", cls: "bg-success/10 text-success border-success/30" },
    pendente: { label: "Revisão pendente", cls: "bg-warning/10 text-warning border-warning/30" },
  };
  return <span className={cn("chip text-[10px]", map[status].cls)}>{map[status].label}</span>;
}

type View = "list" | "detail" | "new";

export default function Solicitacoes() {
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [filterChannel, setFilterChannel] = useState<RequestChannel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(true);

  const [newForm, setNewForm] = useState({
    client: "",
    type: "entrega" as DeliveryType,
    destination: "",
    items: "",
    notes: "",
    subject: "",
  });

  const filtered = SERVICE_REQUESTS.filter(r => {
    if (filterChannel !== "all" && r.channel !== filterChannel) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.client.toLowerCase().includes(search.toLowerCase()) && !r.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openDetail = (req: ServiceRequest) => {
    setSelected(req);
    setView("detail");
    setShowAiPanel(true);
  };

  if (view === "new") {
    return (
      <div className="p-6 max-w-[800px] mx-auto space-y-6">
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Voltar às solicitações
        </button>

        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 grid place-items-center">
                <PenLine className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">Cadastro manual de solicitação</span>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Cliente *</label>
                <select
                  value={newForm.client}
                  onChange={e => setNewForm(f => ({ ...f, client: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Selecione o cliente</option>
                  {["3L", "Bacio di Latte", "Froneri", "Heineken", "Metalfrio T1", "Metalfrio T2", "Natural One", "Nestlé", "Seara", "Solar"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tipo *</label>
                <select
                  value={newForm.type}
                  onChange={e => setNewForm(f => ({ ...f, type: e.target.value as DeliveryType }))}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Assunto / Descrição</label>
              <input
                value={newForm.subject}
                onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Ex: Reentrega de sorvetes devolvidos por avaria"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Endereço de destino</label>
              <input
                value={newForm.destination}
                onChange={e => setNewForm(f => ({ ...f, destination: e.target.value }))}
                placeholder="Rua, número — Cidade/UF"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Itens (um por linha: quantidade x descrição)</label>
              <textarea
                value={newForm.items}
                onChange={e => setNewForm(f => ({ ...f, items: e.target.value }))}
                placeholder={"45 x Sorvete Froneri 2L\n30 x Gelato Bacio 500ml"}
                rows={4}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Observações</label>
              <textarea
                value={newForm.notes}
                onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Informações adicionais sobre a solicitação…"
                rows={3}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Btn variant="default" onClick={() => setView("list")}>Cancelar</Btn>
              <Btn variant="primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Cadastrar solicitação
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "detail" && selected) {
    const ChannelIcon = CHANNEL_ICONS[selected.channel];
    const channelMeta = CHANNEL_META[selected.channel];
    const statusMeta = REQUEST_STATUS_META[selected.status];
    const aiData = AI_EXTRACTIONS[selected.id];

    return (
      <div className="p-6 max-w-[1200px] mx-auto space-y-5">
        <button onClick={() => { setView("list"); setSelected(null); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Voltar às solicitações
        </button>

        {/* Header */}
        <div className="panel p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("h-12 w-12 rounded-2xl grid place-items-center", selected.channel === "email" ? "bg-info/10" : selected.channel === "whatsapp" ? "bg-success/10" : "bg-primary/10")}>
                <ChannelIcon className={cn("h-5 w-5", selected.channel === "email" ? "text-info" : selected.channel === "whatsapp" ? "text-success" : "text-primary")} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                  <span className={cn("chip text-[10px]", channelMeta.color)}>{channelMeta.label}</span>
                  <span className={cn("chip text-[10px]", statusMeta.color)}>{statusMeta.label}</span>
                  {aiData && <AiStatusBadge status={aiData.status} />}
                </div>
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{selected.senderName}</span>
                  <span>{selected.senderEmail}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{selected.receivedAt}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {selected.status === "pendente" && (
                <Btn variant="primary"><CheckCircle2 className="h-3.5 w-3.5" /> Converter em entrega</Btn>
              )}
              {selected.status === "convertida" && selected.convertedTo && (
                <span className="chip bg-success/10 text-success border-success/30 text-xs">
                  Convertida → {selected.convertedTo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Message body */}
          <div className={cn(showAiPanel && aiData ? "col-span-5" : "col-span-8")}>
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  {selected.channel === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5 text-success" /> : <Mail className="h-3.5 w-3.5 text-info" />}
                  {selected.channel === "whatsapp" ? "Mensagem WhatsApp" : selected.channel === "email" ? "E-mail recebido" : selected.channel === "api" ? "Dados da integração" : "Registro manual"}
                </span>
              </div>
              <div className="p-5">
                <div className={cn(
                  "rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap",
                  selected.channel === "whatsapp"
                    ? "bg-success/5 border border-success/10"
                    : "bg-surface-2 border border-border"
                )}>
                  {selected.fullBody}
                </div>
              </div>
              {selected.status !== "convertida" && selected.status !== "recusada" && (
                <div className="border-t border-border p-5">
                  <div className="flex gap-3">
                    <textarea
                      placeholder="Responder ao solicitante…"
                      rows={2}
                      className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                    <Btn variant="primary" className="self-end">
                      <Send className="h-3.5 w-3.5" /> Enviar
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Extraction Panel */}
          {showAiPanel && aiData && (
            <div className="col-span-4 space-y-4">
              <div className="panel border-primary/20">
                <div className="panel-header bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">Extração IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConfidenceBadge value={aiData.confidence} />
                    <button onClick={() => setShowAiPanel(false)} className="h-6 w-6 rounded-lg hover:bg-accent grid place-items-center">
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {/* Overall accuracy meter */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Confiança geral</span>
                        <span className={cn("text-sm font-bold tnum",
                          aiData.confidence >= 95 ? "text-success" : aiData.confidence >= 85 ? "text-warning" : "text-destructive"
                        )}>{aiData.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all",
                            aiData.confidence >= 95 ? "bg-success" : aiData.confidence >= 85 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${aiData.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extracted fields */}
                  {aiData.fields.map((field, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-border last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{field.label}</div>
                        <div className="text-sm mt-0.5">{field.value}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 mt-1">
                        <span className={cn("text-[10px] tnum font-semibold",
                          field.confidence >= 95 ? "text-success" : field.confidence >= 85 ? "text-warning" : "text-destructive"
                        )}>
                          {field.confidence}%
                        </span>
                        {field.confidence < 90 && (
                          <AlertCircle className="h-3 w-3 text-warning" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* AI Suggestions */}
                  {aiData.suggestions.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] uppercase tracking-wider text-primary font-medium mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Sugestões da IA
                      </div>
                      {aiData.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 py-1.5">
                          <span className="text-primary text-xs mt-0.5">→</span>
                          <span className="text-xs text-muted-foreground">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 flex gap-2">
                    <Btn variant="primary" className="flex-1 justify-center text-[11px]">
                      <Eye className="h-3 w-3" /> Aprovar dados
                    </Btn>
                    <Btn variant="default" className="text-[11px]">
                      <RefreshCw className="h-3 w-3" /> Re-analisar
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar info */}
          <div className={cn(showAiPanel && aiData ? "col-span-3" : "col-span-4", "space-y-4")}>
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold">Detalhes</span>
                {!showAiPanel && aiData && (
                  <button onClick={() => setShowAiPanel(true)} className="flex items-center gap-1 text-[10px] text-primary font-medium hover:underline">
                    <Brain className="h-3 w-3" /> Ver extração IA
                  </button>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Cliente</div>
                  <div className="text-sm font-medium">{selected.client}</div>
                </div>
                {selected.destination && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Destino</div>
                    <div className="text-sm flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />{selected.destination}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Itens</div>
                  <div className="space-y-1">
                    {selected.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span>{it.qty}× {it.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selected.notes && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Observações</div>
                    <div className="text-xs text-muted-foreground">{selected.notes}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold">Ações</span>
              </div>
              <div className="p-4 space-y-2">
                {selected.status === "pendente" && (
                  <>
                    <Btn variant="primary" className="w-full justify-center"><CheckCircle2 className="h-3.5 w-3.5" /> Converter em entrega</Btn>
                    <Btn variant="danger" className="w-full justify-center"><X className="h-3.5 w-3.5" /> Recusar solicitação</Btn>
                  </>
                )}
                {selected.status === "em_analise" && (
                  <Btn variant="primary" className="w-full justify-center"><CheckCircle2 className="h-3.5 w-3.5" /> Converter em entrega</Btn>
                )}
                {selected.status === "convertida" && (
                  <div className="text-center text-xs text-success py-2">✓ Já convertida em entrega</div>
                )}
                {selected.status === "recusada" && (
                  <div className="text-center text-xs text-destructive py-2">✕ Solicitação recusada</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Solicitações"
        subtitle="Receba, visualize e converta solicitações em entregas"
        actions={
          <Btn variant="primary" onClick={() => setView("new")}>
            <Plus className="h-3.5 w-3.5" /> Cadastro manual
          </Btn>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {(["all", "email", "whatsapp", "api", "manual"] as const).map(ch => {
            const Icon = ch === "all" ? Package : CHANNEL_ICONS[ch];
            return (
              <button
                key={ch}
                onClick={() => setFilterChannel(ch)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 h-8 rounded-xl text-xs font-medium border whitespace-nowrap transition",
                  filterChannel === ch
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {ch === "all" ? "Todos" : CHANNEL_META[ch].label}
              </button>
            );
          })}
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          {(["all", "pendente", "em_analise", "convertida", "recusada"] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={cn(
                "px-3 h-8 rounded-xl text-xs font-medium border whitespace-nowrap transition",
                filterStatus === st
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {st === "all" ? "Todos" : REQUEST_STATUS_META[st].label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative max-w-[240px]">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Request list */}
      <div className="panel">
        <div className="divide-y divide-border">
          {filtered.map(req => {
            const ChannelIcon = CHANNEL_ICONS[req.channel];
            const channelMeta = CHANNEL_META[req.channel];
            const statusMeta = REQUEST_STATUS_META[req.status];
            const aiData = AI_EXTRACTIONS[req.id];
            return (
              <button
                key={req.id}
                onClick={() => openDetail(req)}
                className="w-full flex items-center gap-4 p-4 hover:bg-accent/40 transition text-left"
              >
                <div className={cn(
                  "h-10 w-10 rounded-xl grid place-items-center shrink-0",
                  req.channel === "email" ? "bg-info/10" : req.channel === "whatsapp" ? "bg-success/10" : req.channel === "api" ? "bg-warning/10" : "bg-primary/10"
                )}>
                  <ChannelIcon className={cn(
                    "h-5 w-5",
                    req.channel === "email" ? "text-info" : req.channel === "whatsapp" ? "text-success" : req.channel === "api" ? "text-warning" : "text-primary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                    <span className="text-sm font-medium">{req.client}</span>
                    <span className={cn("chip text-[10px]", channelMeta.color)}>{channelMeta.label}</span>
                    <span className={cn("chip text-[10px]", statusMeta.color)}>{statusMeta.label}</span>
                    {aiData && (
                      <span className="chip text-[10px] bg-primary/10 text-primary border-primary/30 flex items-center gap-1">
                        <Brain className="h-2.5 w-2.5" /> {aiData.confidence}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-0.5 truncate">{req.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{req.preview}</p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <div className="text-xs text-muted-foreground">{req.receivedAt}</div>
                  <div className="text-xs text-muted-foreground">{req.senderName}</div>
                  {req.convertedTo && (
                    <div className="text-xs text-success font-medium">→ {req.convertedTo}</div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">Nenhuma solicitação encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}
