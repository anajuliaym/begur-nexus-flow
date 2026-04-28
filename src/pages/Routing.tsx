import { PageHeader, Btn, Filters } from "@/components/ui-kit";
import { TRIPS, ORDERS } from "@/data/mock";
import { Route, MapPin, Truck, TrendingUp, Sparkles, Plus, FileText } from "lucide-react";

export default function Routing() {
  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Roteirização e planejamento de viagens"
        subtitle="Composição · sequenciamento · viabilidade · geração de manifesto"
        actions={<>
          <Btn variant="outline"><FileText className="h-3 w-3"/> Manifesto</Btn>
          <Btn variant="primary"><Sparkles className="h-3 w-3"/> Otimizar onda com IA</Btn>
        </>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><Route className="h-3.5 w-3.5"/> Viagens ativas · viabilidade</div>
            <Filters items={["Todas","Planejadas","Em andamento","Manifesto pronto","Encerradas"]}/>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground border-b border-border">
                <tr className="[&>th]:text-left [&>th]:font-medium [&>th]:px-3 [&>th]:py-2.5 uppercase tracking-wider text-[10px]">
                  <th>Viagem</th><th>Motorista</th><th>Veículo</th><th>Região</th><th>Paradas</th><th>Distância</th><th>Pedágio</th><th>Receita</th><th>Custo</th><th>Pgto motorista</th><th>Margem</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {TRIPS.map(t => {
                  const toll = Math.round(t.distance.split(" ")[0] as any * 0.42 * 100) / 100;
                  const pay = Math.round(t.revenue * 0.18);
                  return (
                    <tr key={t.id} className="border-b border-border row-hover">
                      <td className="px-3 py-2.5 font-mono text-[11px] text-primary">{t.id}</td>
                      <td className="px-3 py-2.5 font-medium">{t.driver}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{t.vehicle}</td>
                      <td className="px-3 py-2.5">{t.region}</td>
                      <td className="px-3 py-2.5">{t.stops}</td>
                      <td className="px-3 py-2.5">{t.distance}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">R$ {toll}</td>
                      <td className="px-3 py-2.5 text-success">R$ {t.revenue.toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">R$ {t.cost.toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">R$ {pay.toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-2.5">
                        <span className={`font-semibold ${t.margin >= 30 ? "text-success" : t.margin >= 25 ? "text-warning" : "text-destructive"}`}>{t.margin}%</span>
                      </td>
                      <td className="px-3 py-2.5"><span className="chip border-border text-muted-foreground">{t.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trip composer */}
        <div className="col-span-12 xl:col-span-4 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> Compositor de viagem · TRP-44219</div>
            <span className="chip bg-warning/10 text-warning border-warning/30">rascunho</span>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Motorista</div>
                <div className="mt-1 px-2.5 py-1.5 rounded border border-border bg-surface-2">Patrícia Souza</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Veículo</div>
                <div className="mt-1 px-2.5 py-1.5 rounded border border-border bg-surface-2">Fiorino TRC-3344</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Saída</div>
                <div className="mt-1 px-2.5 py-1.5 rounded border border-border bg-surface-2">Hoje 13:40</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Região</div>
                <div className="mt-1 px-2.5 py-1.5 rounded border border-border bg-surface-2">Zona Leste/SP</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Paradas · 8 selecionadas</div>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {ORDERS.slice(0, 8).map((o, i) => (
                  <div key={o.id} className="flex items-center gap-2 px-2 py-1.5 rounded border border-border bg-surface-1">
                    <span className="h-5 w-5 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold">{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-muted-foreground">{o.id}</div>
                      <div className="text-[11px] truncate">{o.destination}</div>
                    </div>
                    <MapPin className="h-3 w-3 text-muted-foreground"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-primary"><TrendingUp className="h-3 w-3"/><span className="font-semibold text-xs">Viabilidade</span></div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Receita","R$ 2.840","success"],
                  ["Custo","R$ 1.920","muted-foreground"],
                  ["Margem","32,4%","success"],
                ].map(([l,v,c]) => (
                  <div key={l}>
                    <div className="text-[10px] text-muted-foreground">{l}</div>
                    <div className={`text-sm font-semibold tnum`} style={{color:`hsl(var(--${c}))`}}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground">Inclui pedágios (R$ 38), pagamento ao motorista (R$ 511), combustível (R$ 184).</div>
            </div>

            <div className="flex gap-1.5">
              <Btn variant="outline" className="flex-1">Salvar rascunho</Btn>
              <Btn variant="primary" className="flex-1"><Truck className="h-3 w-3"/> Gerar manifesto</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
