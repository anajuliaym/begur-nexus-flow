import { useState } from "react";
import { PageHeader, Btn } from "@/components/ui-kit";
import { Users, Truck, Boxes, Workflow, Shield, ChevronRight, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "users", label: "Usuários e papéis", icon: Users, count: 38 },
  { id: "customers", label: "Clientes", icon: Users, count: 84 },
  { id: "carriers", label: "Transportadoras / agregados", icon: Truck, count: 12 },
  { id: "equipment", label: "Tipos de equipamento", icon: Boxes, count: 64 },
  { id: "workflows", label: "Status e fluxos", icon: Workflow, count: 9 },
  { id: "policies", label: "Políticas de segurança", icon: Shield, count: 5 },
];

const ROLES = [
  { name: "Gerente de Operações", users: 4, perms: ["acesso_total"], desc: "Visibilidade operacional total e poder de override" },
  { name: "Analista", users: 12, perms: ["captacao","pedidos","ocorrencias"], desc: "Validação de solicitações e comunicação com cliente" },
  { name: "Operador de Cross-dock", users: 8, perms: ["cross_docking","bipagem"], desc: "Separação no armazém e despacho" },
  { name: "Operador de Monitoramento", users: 6, perms: ["rastreamento","ocorrencias","comunicacao"], desc: "Rastreamento em tempo real e tratativa de exceções" },
  { name: "Cliente", users: 412, perms: ["portal_self_service"], desc: "Acesso somente ao portal externo" },
  { name: "Administrador", users: 2, perms: ["tudo"], desc: "Administração de sistema e cadastros mestres" },
];

export default function Admin() {
  const [active, setActive] = useState("users");
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Admin · cadastros e configuração"
        subtitle="Configuração do sistema, usuários, papéis e regras de fluxo"
        actions={<><Btn variant="primary"><Plus className="h-3 w-3"/> Nova entidade</Btn></>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 panel p-2 space-y-1 h-fit">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} className={cn(
              "w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs",
              active === s.id ? "bg-primary/15 text-primary" : "hover:bg-accent text-muted-foreground"
            )}>
              <s.icon className="h-3.5 w-3.5"/>
              <span className="flex-1 text-left">{s.label}</span>
              <span className="tnum opacity-70">{s.count}</span>
            </button>
          ))}
        </div>

        <div className="col-span-9 space-y-4">
          <div className="panel">
            <div className="panel-header">
              <div className="text-sm font-semibold flex items-center gap-2"><Users className="h-3.5 w-3.5"/> Papéis e permissões</div>
              <Btn variant="primary"><Plus className="h-3 w-3"/> Novo papel</Btn>
            </div>
            <div className="divide-y divide-border">
              {ROLES.map(r => (
                <div key={r.name} className="p-4 flex items-center gap-4 hover:bg-accent/30">
                  <div className="h-10 w-10 rounded-md bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-bold">
                    {r.name.split(" ").map(s=>s[0]).join("").slice(0,2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.desc}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.perms.map(p => <span key={p} className="chip text-[10px] bg-surface-3 border-border text-muted-foreground font-mono">{p}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold tnum">{r.users}</div>
                    <div className="text-[10px] text-muted-foreground">usuários</div>
                  </div>
                  <Btn variant="ghost"><ChevronRight className="h-3 w-3"/></Btn>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="text-sm font-semibold flex items-center gap-2"><Workflow className="h-3.5 w-3.5"/> Regras de fluxo · status do pedido</div>
              <Btn variant="outline"><Sparkles className="h-3 w-3"/> Sugerir com IA</Btn>
            </div>
            <div className="p-4 space-y-2">
              {[
                { from: "Aguardando separação", to: "Aguardando roteirização", trigger: "Todos os itens separados e conferidos", auto: true },
                { from: "Aguardando roteirização", to: "Em rota", trigger: "Manifesto gerado e aceito pelo motorista", auto: true },
                { from: "Em rota", to: "Ocorrência pendente", trigger: "Motorista sinaliza problema OU ETA estourado em 20min", auto: true },
                { from: "Ocorrência pendente", to: "Não entregue", trigger: "Confirmação manual do analista após 2 tentativas", auto: false },
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-border bg-surface-1 text-xs">
                  <span className="chip border-border text-muted-foreground">{w.from}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground"/>
                  <span className="chip border-border text-muted-foreground">{w.to}</span>
                  <span className="text-muted-foreground flex-1 ml-2 truncate">quando · {w.trigger}</span>
                  <span className={`chip text-[10px] ${w.auto ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning border-warning/30"}`}>
                    {w.auto ? "Automático" : "Manual"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
