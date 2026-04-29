import { PageHeader, Btn } from "@/components/ui-kit";
import { INTAKE } from "@/data/mock";
import { Mail, MessageCircle, Plug, FileText, Globe, PenLine, AlertTriangle, CheckCircle2, Clock, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "@/contexts/ModeContext";

const CHANNEL_META = {
  "Email":         { icon: Mail,         label: "E-mail", tone: "text-info" },
  "WhatsApp":      { icon: MessageCircle, label: "WhatsApp", tone: "text-success" },
  "API/Lincros":   { icon: Plug,         label: "API / Lincros", tone: "text-primary" },
  "NF Física":     { icon: FileText,     label: "NF física", tone: "text-warning" },
  "Portal":        { icon: Globe,        label: "Portal cliente", tone: "text-info" },
  "Manual":        { icon: PenLine,      label: "Manual", tone: "text-muted-foreground" },
};

const NORM_META = {
  auto_ok:      { label: "Padronizado automaticamente", cls: "bg-success/10 text-success border-success/30",   icon: CheckCircle2 },
  needs_review: { label: "Precisa revisão humana",       cls: "bg-warning/10 text-warning border-warning/30",   icon: AlertTriangle },
  manual:       { label: "100% manual",                  cls: "bg-destructive/10 text-destructive border-destructive/30", icon: PenLine },
  queued:       { label: "Em fila (OCR/transcrição)",    cls: "bg-info/10 text-info border-info/30",            icon: Clock },
  rejected:     { label: "Rejeitado",                    cls: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
};

export default function Intake() {
  const { mode } = useMode();
  const total = INTAKE.length;
  const auto = INTAKE.filter(i => i.normalization.status === "auto_ok").length;
  const review = INTAKE.filter(i => i.normalization.status === "needs_review").length;
  const manual = INTAKE.filter(i => i.normalization.status === "manual" || i.normalization.status === "queued").length;

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Intake multicanal"
        subtitle="Toda solicitação Begur entra por aqui — independente do canal. Honestidade primeiro: a entrada é fragmentada."
        actions={<>
          <Btn><PenLine className="h-3 w-3" /> Lançamento manual</Btn>
          <Btn variant="primary"><Bot className="h-3 w-3" /> Acionar normalização em lote</Btn>
        </>}
      />

      {/* Canais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(CHANNEL_META).map(([key, meta]) => {
          const Icon = meta.icon;
          const count = INTAKE.filter(i => i.channel === key).length;
          return (
            <div key={key} className="panel p-3">
              <div className="flex items-center justify-between">
                <Icon className={cn("h-4 w-4", meta.tone)} />
                <div className="text-2xl font-bold tnum">{count}</div>
              </div>
              <div className="text-xs font-semibold mt-1">{meta.label}</div>
              <div className="text-[10px] text-muted-foreground">hoje</div>
            </div>
          );
        })}
      </div>

      {/* Funil de padronização */}
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold">Funil de padronização</div>
            <div className="text-[11px] text-muted-foreground">Quanto da entrada bruta vira dado utilizável sem intervenção humana.</div>
          </div>
          <div className="text-[11px] text-muted-foreground">{total} entradas hoje</div>
        </div>
        <div className="flex h-8 rounded overflow-hidden">
          <div className="bg-success/40 flex items-center justify-center text-[11px] font-semibold text-success" style={{ width: `${(auto/total)*100}%` }}>{auto} auto</div>
          <div className="bg-warning/40 flex items-center justify-center text-[11px] font-semibold text-warning" style={{ width: `${(review/total)*100}%` }}>{review} revisar</div>
          <div className="bg-destructive/40 flex items-center justify-center text-[11px] font-semibold text-destructive" style={{ width: `${(manual/total)*100}%` }}>{manual} manual/fila</div>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground italic">
          {mode === "real"
            ? "Hoje: maioria precisa de revisão. Bacio manda áudio de WhatsApp; Heineken muda layout da planilha; Seara entrega NF em papel. A normalização é o trabalho real do começo do funil."
            : "Alvo: 80%+ auto, com cliente padronizado via portal/API. Resto vai para fila com SLA de tratamento."}
        </div>
      </div>

      {/* Lista entradas */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold">Caixa de entrada — todos os canais</div>
          <div className="flex gap-2">
            <Btn>Filtrar por cliente</Btn>
            <Btn>Apenas pendentes</Btn>
          </div>
        </div>
        <div className="divide-y divide-border">
          {INTAKE.map(item => {
            const channel = CHANNEL_META[item.channel];
            const norm = NORM_META[item.normalization.status];
            const Icon = channel.icon;
            const NormIcon = norm.icon;
            return (
              <div key={item.id} className="p-3 row-hover">
                <div className="flex items-start gap-3">
                  <div className={cn("h-8 w-8 rounded-md grid place-items-center bg-surface-2 border border-border", channel.tone)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                      <span className="text-xs font-semibold">{item.client}</span>
                      <span className="chip bg-surface-2 text-muted-foreground border-border text-[10px]">{item.rawFormat}</span>
                      {item.hasAttachment && <span className="chip bg-info/10 text-info border-info/30 text-[10px]">📎 {item.attachmentType}</span>}
                      <span className="text-[11px] text-muted-foreground ml-auto">{item.received}</span>
                    </div>
                    <div className="text-sm font-medium truncate">{item.subject}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{item.from} · {item.preview}</div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("chip text-[10px]", norm.cls)}>
                        <NormIcon className="h-3 w-3" />
                        {norm.label} · {Math.round(item.normalization.confidence * 100)}%
                      </span>
                      {item.normalization.missingFields.length > 0 && (
                        <span className="text-[10px] text-warning">
                          Faltam: {item.normalization.missingFields.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Btn variant="primary">Triagem</Btn>
                    <Btn>Abrir</Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
