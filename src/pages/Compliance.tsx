import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { COMPLIANCE } from "@/data/mock";
import { ShieldCheck, AlertTriangle, FileText, Bell } from "lucide-react";

export default function Compliance() {
  const tone: any = { ok: "success", warning: "warning", critical: "destructive" };
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Documents & compliance"
        subtitle="Driver documents, vehicle insurance, maintenance and cargo coverage"
        actions={<><Btn variant="outline"><Bell className="h-3 w-3"/> Alert rules</Btn><Btn variant="primary"><FileText className="h-3 w-3"/> Upload document</Btn></>}
      />

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: "Compliant", v: 142, t: "success" },
          { l: "Expiring < 30d", v: 18, t: "warning" },
          { l: "Critical / expired", v: 4, t: "destructive" },
          { l: "Coverage value", v: "R$ 4.8M", t: "primary" },
        ].map(k => (
          <div key={k.l} className="panel p-4">
            <div className="stat-label">{k.l}</div>
            <div className="stat-value mt-1.5" style={{ color: `hsl(var(--${k.t}))` }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5"/> Document status</div>
          <Filters items={["All","Drivers","Vehicles","Insurance","Maintenance"]}/>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border">
              <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                <th>Entity</th><th>Item</th><th>Expires</th><th>Days left</th><th>Status</th><th></th>
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
                        {d.status}
                      </span>
                    </td>
                    <td className="px-3 py-3"><Btn variant="ghost">Renew</Btn></td>
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
