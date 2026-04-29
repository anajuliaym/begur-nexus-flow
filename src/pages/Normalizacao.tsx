import { PageHeader, Btn } from "@/components/ui-kit";
import { MAPPING_RULES, STATUS_DEPARA, CUSTOMERS } from "@/data/mock";
import { CheckCircle2, AlertTriangle, GitBranch, Database, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Normalizacao() {
  const broken = MAPPING_RULES.filter(r => r.status === "quebrado").length;
  const draft = MAPPING_RULES.filter(r => r.status === "rascunho").length;

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Normalização de dados (master data + de-para)"
        subtitle="Antes de qualquer dashboard bonito, alguém precisa traduzir o vocabulário de cada cliente para o vocabulário Begur."
        actions={<>
          <Btn>Importar planilha cliente</Btn>
          <Btn variant="primary"><GitBranch className="h-3 w-3" /> Nova regra de mapeamento</Btn>
        </>}
      />

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="panel p-4"><div className="stat-label">Clientes mapeados</div><div className="stat-value mt-1">{CUSTOMERS.length}</div><div className="text-[10px] text-muted-foreground">de 12 ativos</div></div>
        <div className="panel p-4"><div className="stat-label">Regras ativas</div><div className="stat-value mt-1 text-success">{MAPPING_RULES.filter(r=>r.status==="ativo").length}</div></div>
        <div className="panel p-4"><div className="stat-label">Rascunho</div><div className="stat-value mt-1 text-warning">{draft}</div><div className="text-[10px] text-muted-foreground">precisa validação</div></div>
        <div className="panel p-4"><div className="stat-label">Quebradas</div><div className="stat-value mt-1 text-destructive">{broken}</div><div className="text-[10px] text-muted-foreground">cliente mudou layout</div></div>
      </div>

      {/* Por que isso importa */}
      <div className="panel p-4 bg-warning/5 border-warning/30">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="text-[12px]">
            <div className="font-semibold text-warning mb-1">Garbage in, garbage out — por que essa camada existe</div>
            <div className="text-muted-foreground leading-relaxed">
              Cada cliente Begur tem coluna, status e lógica diferentes. <span className="text-foreground">Heineken</span> chama de <code className="text-primary">STATUS_PEDIDO</code>; <span className="text-foreground">Nestlé</span> chama de <code className="text-primary">delivery_state</code>; <span className="text-foreground">Bacio</span> manda no WhatsApp em texto livre. Sem essa camada, ocorrências viram inconsistentes, KPIs mentem, e a IA do futuro vira automação do erro.
            </div>
          </div>
        </div>
      </div>

      {/* Regras de mapeamento */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold">Regras de mapeamento (cliente → Begur)</div>
          <div className="text-[11px] text-muted-foreground">{MAPPING_RULES.length} regras</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Cliente</th>
                <th className="text-left px-3 py-2 font-medium">Campo</th>
                <th className="text-left px-3 py-2 font-medium">Coluna do cliente</th>
                <th className="text-left px-3 py-2 font-medium">Campo Begur</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-right px-3 py-2 font-medium">Hits</th>
                <th className="text-right px-4 py-2 font-medium">Último uso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MAPPING_RULES.map((r, i) => (
                <tr key={i} className="row-hover">
                  <td className="px-4 py-2 font-medium">{r.client}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.field}</td>
                  <td className="px-3 py-2"><code className="text-[11px] bg-surface-2 px-1.5 py-0.5 rounded text-warning">{r.clientColumn}</code></td>
                  <td className="px-3 py-2"><code className="text-[11px] bg-surface-2 px-1.5 py-0.5 rounded text-primary">{r.begurField}</code></td>
                  <td className="px-3 py-2">
                    <span className={cn("chip text-[10px]",
                      r.status === "ativo" ? "bg-success/10 text-success border-success/30" :
                      r.status === "rascunho" ? "bg-warning/10 text-warning border-warning/30" :
                      "bg-destructive/10 text-destructive border-destructive/30"
                    )}>
                      {r.status === "ativo" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tnum text-muted-foreground">{r.hits.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-2 text-right text-muted-foreground text-[11px]">{r.lastUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* De-para de status */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="text-sm font-semibold">De-para de status — exemplo concreto</div>
            <div className="text-[11px] text-muted-foreground">"entregue", "ENT-OK", "concluído", "Entregue ✅" — tudo vira <code className="text-primary">delivered</code>.</div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {STATUS_DEPARA.map((m, i) => (
            <div key={i} className="px-4 py-2 flex items-center gap-3 row-hover">
              <span className="text-xs text-muted-foreground w-24">{m.client}</span>
              <code className="text-[11px] bg-surface-2 px-2 py-0.5 rounded text-warning">{m.incoming}</code>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <code className="text-[11px] bg-surface-2 px-2 py-0.5 rounded text-primary">{m.mapped}</code>
              <CheckCircle2 className="h-3.5 w-3.5 text-success ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
