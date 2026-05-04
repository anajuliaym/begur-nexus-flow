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
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<RequestChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  api: Globe,
  manual: PenLine,
};

type View = "list" | "detail" | "new";

export default function Solicitacoes() {
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [filterChannel, setFilterChannel] = useState<RequestChannel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  const [search, setSearch] = useState("");

  // New request form state
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

    return (
      <div className="p-6 max-w-[900px] mx-auto space-y-5">
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
          <div className="col-span-8">
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
              {/* Reply area */}
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

          {/* Sidebar info */}
          <div className="col-span-4 space-y-4">
            <div className="panel">
              <div className="panel-header">
                <span className="text-xs font-semibold">Detalhes</span>
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

            {/* Actions */}
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
