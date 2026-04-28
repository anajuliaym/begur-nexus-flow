import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { COMPLIANCE } from "@/data/mock";
import { ShieldCheck, AlertTriangle, FileText, Bell } from "lucide-react";

const STATUS_LABEL: Record<string, string> = { ok: "ok", warning: "atenção", critical: "crítico" };

export default function Compliance() {
  const tone: any = { ok: "success", warning: "warning", critical: "destructive" };
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Documentos e compliance"
        subtitle="Documentos de motoristas, seguros de veículos, manutenção e cobertura de carga"
        actions={<><Btn variant="outline"><Bell className="h-3 w-3"/> Regras de alerta</Btn><Btn variant="primary"><FileText className="h-3 w-3"/> Enviar documento</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Em conformidade", v: 142, t: "success" },
          { l: "Vence em < 30d", v: 18, t: "warning" },
          { l: "Críticos / vencidos", v: 4, t: "destructive" },
          { l: "Valor de cobertura", v: "R$ 4,8M", t: "primary" },
        ].map(k => (
          <div key={k.l} className="panel p-4">
            <div className="stat-label">{k.l}</div>
            <div className="stat-value mt-1.5" style={{ color: `hsl(var(--${k.t}))` }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5"/> Status de documentos</div>
          <Filters items={["Todos","Motoristas","Veículos","Seguros","Manutenção"]}/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border">
              <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                <th>Entidade</th><th>Item</th><th>Vence em</th><th>Dias restantes</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody className="tnum">
              {COMPLIANCE.map((d, i) => {
                const days = Math.ceil((new Date(d.expires).getTime() - Date.now()) / (1000*60*60*24));
                return (
                  <tr key={i} className="border-b border-border row-hover">
                    <td className="px-3 py-3 font-medium">{d.entity}</td>
                    <td className="px-3 py-3">{d.item}</td>
                    <td className="px-3 py-3 text-muted-foreground">{d.expires}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{days}d</span>
                        <div className="h-1 w-20 bg-surface-3 rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, days/3))}%`, background: `hsl(var(--${tone[d.status]}))` }}/>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`chip ${d.status==="ok"?"bg-success/10 text-success border-success/30":d.status==="warning"?"bg-warning/10 text-warning border-warning/30":"bg-destructive/10 text-destructive border-destructive/30"}`}>
                        {d.status === "critical" && <AlertTriangle className="h-2.5 w-2.5"/>}
                        {STATUS_LABEL[d.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3"><Btn variant="ghost">Renovar</Btn></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
