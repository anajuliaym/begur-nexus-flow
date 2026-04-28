import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Mail, AlertTriangle, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { icon: Mail, text: "Resumir novas solicitações na caixa de entrada" },
  { icon: AlertTriangle, text: "Quais pedidos vão estourar SLA hoje?" },
  { icon: Package, text: "Sugerir consolidações para a onda de amanhã" },
  { icon: TrendingUp, text: "Top 3 rotas por margem nesta semana" },
];

const SCRIPTED = [
  "Analisando 1.284 pedidos ativos em 6 hubs…",
  "Detectei 47 pedidos com risco de SLA — 31 na Zona Leste/SP, 9 em Campinas, 7 no Vale.",
  "Sugiro antecipar o cluster da Zona Leste para a onda 2 (saída 13:40), reatribuindo à motorista Patrícia Souza (capacidade ociosa de 4h).",
  "Impacto estimado: ✅ recuperação de SLA em 28 pedidos · 💰 +R$ 1.240 de margem · ⏱ −38 min de ETA médio.",
  "Quer que eu rascunhe a alteração de rota e notifique os clientes afetados?",
];

export function AiCopilot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Olá Renata 👋 Sou o Begur Copilot. Estou monitorando a operação em tempo real. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setMessages(m => [...m, { role: "ai", text: SCRIPTED[i] }]);
      i++;
      if (i >= SCRIPTED.length) { clearInterval(interval); setTyping(false); }
    }, 700);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-[440px] bg-card border-l border-border flex flex-col animate-slide-up">
        <div className="h-14 px-4 flex items-center gap-2 border-b border-border">
          <div className="h-7 w-7 rounded-md bg-gradient-primary grid place-items-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Begur Copilot</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">IA · inteligência operacional</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 border border-border text-foreground"
              )}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 items-center text-muted-foreground text-xs px-2">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse [animation-delay:.15s]" />
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse [animation-delay:.3s]" />
            </div>
          )}
        </div>

        <div className="px-4 pb-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Sugestões</div>
          <div className="grid grid-cols-2 gap-1.5">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s.text)}
                className="flex items-center gap-2 px-2.5 py-2 text-left rounded-md border border-border bg-surface-2 hover:bg-surface-3 text-xs"
              >
                <s.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{s.text}</span>
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t border-border p-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte qualquer coisa sobre a operação…"
            className="flex-1 bg-surface-2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="h-9 w-9 grid place-items-center rounded-md bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </aside>
    </div>
  );
}
