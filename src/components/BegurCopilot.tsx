import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Quais entregas estão em risco de SLA?",
  "Resuma as ocorrências abertas de hoje",
  "Quais clientes têm mais pendências?",
  "Gerar relatório de performance semanal",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Analisei os dados operacionais. Aqui está o resumo:

📊 **Visão Geral**
- **20 entregas ativas** no pipeline
- **3 ocorrências** pendentes de resolução
- **2 entregas** com SLA em risco

💡 **Recomendações:**
1. Priorizar BGR-0100 (SLA Heineken em 2h)
2. Tratar ocorrência OCR-1100 (recusa cliente)
3. Confirmar veículo para rota Campinas

Posso detalhar algum desses pontos?`,
  sla: `⚠️ **Entregas com SLA em Risco:**

| Entrega | Cliente | SLA | Status |
|---------|---------|-----|--------|
| BGR-0100 | 3L | 4h | Atrasado |
| BGR-0107 | Metalfrio T1 | 6h | Em risco |

**Ações sugeridas:**
- BGR-0100: Contactar motorista Carlos Mendes imediatamente
- BGR-0107: Redirecionar para entregador mais próximo

Deseja que eu abra o detalhe de alguma dessas entregas?`,
  ocorrencias: `📋 **Ocorrências Abertas Hoje:**

1. **OCR-1100** — Recusa (Alta) — Cliente ausente, 2ª tentativa
   → Sugestão: Agendar reentrega para amanhã 08:00

2. **OCR-1102** — Avaria (Alta) — Embalagem violada no CD
   → Sugestão: Separar novo lote + notificar Froneri

3. **OCR-1105** — Equipamento (Alta) — Serial divergente
   → Sugestão: Conferência manual + atualizar NF

Tempo médio de resolução hoje: **2h34min**`,
  clientes: `📊 **Ranking de Pendências por Cliente:**

| Cliente | Ativas | Ocorrências | OTIF |
|---------|--------|-------------|------|
| Heineken | 6 | 1 | 98.8% |
| Seara | 5 | 0 | 96.4% |
| Bacio di Latte | 4 | 1 | 98.5% |
| Metalfrio T1 | 3 | 2 | 94.5% |

⚠️ **Atenção:** Metalfrio T1 está abaixo da meta de OTIF (95%).
Recomendo revisão dos processos de conferência.`,
  relatorio: `📈 **Relatório Semanal — Begur Control Tower**

**Período:** 28/04 a 04/05/2026

**Volume:**
- 127 entregas processadas (+8% vs semana anterior)
- 98.2% OTIF geral
- Tempo médio de ciclo: 6h42min

**Destaques positivos:**
- ✅ Nestlé: 100% no prazo (zero ocorrências)
- ✅ Natural One: integração API sem falhas

**Pontos de atenção:**
- ⚠️ Metalfrio T1: 3 ocorrências de serial divergente
- ⚠️ Rota Campinas: atrasos recorrentes (tráfego)

Deseja exportar este relatório em PDF?`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("sla") || lower.includes("risco") || lower.includes("atraso")) return MOCK_RESPONSES.sla;
  if (lower.includes("ocorr")) return MOCK_RESPONSES.ocorrencias;
  if (lower.includes("client") || lower.includes("pend")) return MOCK_RESPONSES.clientes;
  if (lower.includes("relat") || lower.includes("performance") || lower.includes("semanal")) return MOCK_RESPONSES.relatorio;
  return MOCK_RESPONSES.default;
}

export function BegurCopilot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
      <div className="pointer-events-auto w-[420px] h-[600px] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-border bg-gradient-primary shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            <div>
              <span className="text-sm font-semibold text-primary-foreground">Begur Copilot</span>
              <span className="text-[10px] text-primary-foreground/70 ml-2">IA Operacional</span>
            </div>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-white/20 grid place-items-center transition">
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4 pt-4">
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center mx-auto mb-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Olá, como posso ajudar?</h3>
                <p className="text-xs text-muted-foreground mt-1">Analiso dados operacionais, sugiro ações e gero relatórios.</p>
              </div>
              <div className="space-y-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left px-4 py-2.5 rounded-xl border border-border text-xs hover:bg-accent/50 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-primary/10 grid place-items-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-surface-2 border border-border rounded-bl-md"
              )}>
                <div className="whitespace-pre-wrap leading-relaxed text-[13px]">
                  {msg.content.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                  })}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="h-7 w-7 rounded-lg bg-primary grid place-items-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-surface-2 border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Pergunte ao Copilot…"
              className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center disabled:opacity-40 transition hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground text-center mt-1.5">⌘K para abrir/fechar · Protótipo simulado</div>
        </div>
      </div>
    </div>
  );
}
