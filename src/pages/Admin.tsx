import { useState } from "react";
import { PageHeader, Btn } from "@/components/ui-kit";
import { Settings2, Users, Truck, Boxes, Workflow, Shield, ChevronRight, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "users", label: "Users & roles", icon: Users, count: 38 },
  { id: "customers", label: "Customers", icon: Users, count: 84 },
  { id: "carriers", label: "Carriers / aggregates", icon: Truck, count: 12 },
  { id: "equipment", label: "Equipment types", icon: Boxes, count: 64 },
  { id: "workflows", label: "Status & workflows", icon: Workflow, count: 9 },
  { id: "policies", label: "Security policies", icon: Shield, count: 5 },
];

const ROLES = [
  { name: "Operations Manager", users: 4, perms: ["full_access"], desc: "Full operational visibility & override" },
  { name: "Analyst", users: 12, perms: ["intake","orders","occurrences"], desc: "Request validation & customer comms" },
  { name: "Cross-dock Operator", users: 8, perms: ["cross_docking","scanning"], desc: "Warehouse separation & dispatch" },
  { name: "Monitoring Operator", users: 6, perms: ["tracking","occurrences","comms"], desc: "Real-time tracking & exception handling" },
  { name: "Customer", users: 412, perms: ["portal_self_service"], desc: "External portal access only" },
  { name: "Administrator", users: 2, perms: ["all"], desc: "System & master data administration" },
];

export default function Admin() {
  const [active, setActive] = useState("users");
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Admin · master data & configuration"
        subtitle="System configuration, users, roles and workflow rules"
        actions={<><Btn variant="primary"><Plus className="h-3 w-3"/> New entity</Btn></>}
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
              <div className="text-sm font-semibold flex items-center gap-2"><Users className="h-3.5 w-3.5"/> Roles & permissions</div>
              <Btn variant="primary"><Plus className="h-3 w-3"/> New role</Btn>
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
                    <div className="text-[10px] text-muted-foreground">users</div>
                  </div>
                  <Btn variant="ghost"><ChevronRight className="h-3 w-3"/></Btn>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="text-sm font-semibold flex items-center gap-2"><Workflow className="h-3.5 w-3.5"/> Workflow rules · order status</div>
              <Btn variant="outline"><Sparkles className="h-3 w-3"/> AI suggest</Btn>
            </div>
            <div className="p-4 space-y-2">
              {[
                { from: "Awaiting separation", to: "Awaiting routing", trigger: "All items picked & verified", auto: true },
                { from: "Awaiting routing", to: "In route", trigger: "Trip manifest generated & accepted by driver", auto: true },
                { from: "In route", to: "Exception pending", trigger: "Driver flags issue OR ETA breached by 20min", auto: true },
                { from: "Exception pending", to: "Not delivered", trigger: "Manual analyst confirmation after 2 attempts", auto: false },
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-border bg-surface-1 text-xs">
                  <span className="chip border-border text-muted-foreground">{w.from}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground"/>
                  <span className="chip border-border text-muted-foreground">{w.to}</span>
                  <span className="text-muted-foreground flex-1 ml-2 truncate">when · {w.trigger}</span>
                  <span className={`chip text-[10px] ${w.auto ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning border-warning/30"}`}>
                    {w.auto ? "Auto" : "Manual"}
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
