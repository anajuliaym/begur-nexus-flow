// Begur Control Tower V2 — vertical real: bebidas, sorvetes, refrigerados, equipamentos de refrigeração.
// Modelagem orientada a workflow + handoffs entre atores, não a módulos.

export type OrderStatus =
  | "intake_received"        // entrou (email/WhatsApp/NF/portal/Lincros) — ainda não normalizado
  | "intake_normalizing"     // em normalização / de-para
  | "triage_pending"         // na mesa do analista p/ validação
  | "os_issued"              // OS emitida
  | "awaiting_picking"       // armazém
  | "picking"                // separação por SKU/serial
  | "awaiting_conference"    // conferência manual
  | "awaiting_routing"       // pronto p/ roteirizar
  | "routed"                 // alocado em viagem
  | "manifest_ready"         // romaneio impresso
  | "loaded"                 // carregado
  | "in_route"               // em rota
  | "delivered"              // entregue c/ comprovante
  | "exception"              // ocorrência aberta
  | "redelivery"             // reentrega agendada
  | "returned"               // retornado ao CD
  | "billed";                // faturado / fechamento

export const STATUS_META: Record<OrderStatus, { label: string; tone: string; stage: string }> = {
  intake_received:      { label: "Entrada recebida",        tone: "bg-muted/40 text-muted-foreground border-border", stage: "Intake" },
  intake_normalizing:   { label: "Normalizando",            tone: "bg-info/10 text-info border-info/30", stage: "Intake" },
  triage_pending:       { label: "Triagem pendente",        tone: "bg-warning/10 text-warning border-warning/30", stage: "Atendimento" },
  os_issued:            { label: "OS emitida",              tone: "bg-info/10 text-info border-info/30", stage: "Atendimento" },
  awaiting_picking:     { label: "Aguardando separação",    tone: "bg-warning/10 text-warning border-warning/30", stage: "Armazém" },
  picking:              { label: "Em separação",            tone: "bg-primary/10 text-primary border-primary/30", stage: "Armazém" },
  awaiting_conference:  { label: "Aguardando conferência",  tone: "bg-warning/10 text-warning border-warning/30", stage: "Armazém" },
  awaiting_routing:     { label: "Aguardando roteirização", tone: "bg-info/10 text-info border-info/30", stage: "Distribuição" },
  routed:               { label: "Roteirizado",             tone: "bg-info/10 text-info border-info/30", stage: "Distribuição" },
  manifest_ready:       { label: "Romaneio pronto",         tone: "bg-info/10 text-info border-info/30", stage: "Distribuição" },
  loaded:               { label: "Carregado",               tone: "bg-primary/10 text-primary border-primary/30", stage: "Expedição" },
  in_route:             { label: "Em rota",                 tone: "bg-primary/10 text-primary border-primary/30", stage: "Transporte" },
  delivered:            { label: "Entregue",                tone: "bg-success/10 text-success border-success/30", stage: "Transporte" },
  exception:            { label: "Ocorrência aberta",       tone: "bg-destructive/10 text-destructive border-destructive/30", stage: "Monitoramento" },
  redelivery:           { label: "Reentrega agendada",      tone: "bg-warning/10 text-warning border-warning/30", stage: "Monitoramento" },
  returned:             { label: "Retornado ao CD",         tone: "bg-critical/10 text-[hsl(var(--critical))] border-[hsl(var(--critical))]/30", stage: "Monitoramento" },
  billed:               { label: "Faturado",                tone: "bg-success/10 text-success border-success/30", stage: "Financeiro" },
};

export const STAGES = ["Intake","Atendimento","Armazém","Distribuição","Expedição","Transporte","Monitoramento","Financeiro"] as const;
export type Stage = typeof STAGES[number];

export const OWNERS_BY_STAGE: Record<Stage, string> = {
  Intake: "Sistema / Bot de e-mail",
  Atendimento: "Mesa do Analista",
  "Armazém": "Operador de Cross-dock",
  "Distribuição": "Roteirizador",
  "Expedição": "Líder de Doca",
  Transporte: "Motorista / Agregado",
  Monitoramento: "Squad de Monitoramento",
  Financeiro: "Back-office Financeiro",
};

export interface Order {
  id: string;
  client: string;
  origin: string;
  destination: string;       // PDV, restaurante, rede
  city: string;
  uf: string;
  status: OrderStatus;
  cargo: string;             // SKU principal
  qty: number;
  unit: "cx" | "pallet" | "un";
  temperature: "ambiente" | "refrigerado" | "congelado";
  driver?: string;
  vehicle?: string;
  eta: string;
  sla: "on_track" | "at_risk" | "breached";
  value: number;
  created: string;
  channel: "Email" | "WhatsApp" | "API/Lincros" | "Portal" | "NF Física" | "Manual";
  owner: string;             // ator responsável agora
  awaitingHandoffTo?: string;
  hasPhysicalDoc: boolean;   // tem nota física aguardando digitalização
  serialRequired: boolean;   // exige separação por número de série (equipamentos)
  manifestPrinted: boolean;
}

const clients = ["Heineken", "Nestlé", "Seara", "Froneri", "Natural One", "Bacio di Latte", "Solar Br", "Metalfrio", "3L Logística", "Burger King", "McDonald's"];
const cities = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Porto Alegre", "RS"], ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"], ["Brasília", "DF"],
  ["Campinas", "SP"], ["Goiânia", "GO"], ["Ribeirão Preto", "SP"], ["Florianópolis", "SC"], ["Joinville", "SC"],
];
const cargo = [
  { name: "Chopeira Heineken Sub 30L", temp: "refrigerado" as const, unit: "un" as const, serial: true },
  { name: "Sorvete Bacio Pote 500ml — pallet mix", temp: "congelado" as const, unit: "pallet" as const, serial: false },
  { name: "Freezer horizontal Metalfrio HC-503", temp: "ambiente" as const, unit: "un" as const, serial: true },
  { name: "Hambúrguer Seara cx 2kg", temp: "congelado" as const, unit: "cx" as const, serial: false },
  { name: "Suco Natural One 900ml — fardo", temp: "refrigerado" as const, unit: "cx" as const, serial: false },
  { name: "Nestlé KitKat display PDV", temp: "ambiente" as const, unit: "cx" as const, serial: false },
  { name: "Visa-cooler Solar 4 portas", temp: "ambiente" as const, unit: "un" as const, serial: true },
  { name: "Froneri La Cremeria Pote — pallet", temp: "congelado" as const, unit: "pallet" as const, serial: false },
  { name: "Heineken Long Neck 330ml — fardo 24un", temp: "refrigerado" as const, unit: "cx" as const, serial: false },
  { name: "Kit montagem ilha refrigerada Bacio", temp: "ambiente" as const, unit: "un" as const, serial: true },
];
const drivers = ["Carlos Mendes", "Ana Ribeiro", "João Silva", "Marcos Pereira", "Lucas Almeida", "Patrícia Souza", "Fábio Costa", "Renata Lima"];
const vehicles = ["Truck Refrigerado MNT-4A12", "VUC Frigorífico KLM-2D55", "Toco Câmara RTQ-9988", "Carreta Frigo BPX-1199", "VUC JKW-7720", "Fiorino TRC-3344"];
const channels: Order["channel"][] = ["Email", "WhatsApp", "API/Lincros", "Portal", "NF Física", "Manual"];
const statuses: OrderStatus[] = [
  "intake_received","intake_normalizing","triage_pending","os_issued",
  "awaiting_picking","picking","awaiting_conference","awaiting_routing",
  "routed","manifest_ready","loaded","in_route","in_route","in_route",
  "delivered","delivered","exception","redelivery","returned","billed"
];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export const ORDERS: Order[] = Array.from({ length: 84 }).map((_, i) => {
  const [city, uf] = rand(cities, i * 3);
  const status = rand(statuses, i * 7 + 1);
  const sla = i % 11 === 0 ? "breached" : i % 5 === 0 ? "at_risk" : "on_track";
  const c = rand(cargo, i);
  const meta = STATUS_META[status];
  const transportStages = ["loaded","in_route","delivered","exception","redelivery","returned"];
  return {
    id: `BGR-${(248910 + i).toString()}`,
    client: rand(clients, i),
    origin: i % 3 === 0 ? "CD Begur — Barueri/SP" : i % 3 === 1 ? "CD Begur — Cajamar/SP" : "Cross-dock Begur — Extrema/MG",
    destination: i % 4 === 0 ? `PDV ${rand(["Pão de Açúcar","Carrefour","Atacadão","Assaí"], i)} — ${city}` : `${rand(["Restaurante","Bar","Loja","Filial"], i)} ${rand(["Centro","Vila Olímpia","Moema","Pinheiros","Barra","Savassi"], i)} — ${city}`,
    city, uf,
    status,
    cargo: c.name,
    qty: 1 + (i * 3) % 28,
    unit: c.unit,
    temperature: c.temp,
    driver: transportStages.includes(status) ? rand(drivers, i) : undefined,
    vehicle: transportStages.includes(status) ? rand(vehicles, i) : undefined,
    eta: ["Hoje 14:30","Hoje 17:10","Amanhã 09:00","Amanhã 11:45","Hoje 19:20","Janela 06–10h","Janela 14–18h"][i % 7],
    sla,
    value: 480 + (i * 137) % 4200,
    created: ["há 12 min","há 34 min","há 1h","há 2h","há 3h","Ontem","há 2 dias"][i % 7],
    channel: rand(channels, i),
    owner: OWNERS_BY_STAGE[meta.stage as Stage] ?? "—",
    awaitingHandoffTo: i % 6 === 0 ? OWNERS_BY_STAGE[STAGES[(STAGES.indexOf(meta.stage as Stage) + 1) % STAGES.length]] : undefined,
    hasPhysicalDoc: i % 4 === 0,
    serialRequired: c.serial,
    manifestPrinted: ["loaded","in_route","delivered"].includes(status),
  };
});

// ---------- INTAKE FRAGMENTADO ----------
export interface IntakeItem {
  id: string;
  channel: Order["channel"];
  from: string;
  subject: string;
  preview: string;
  received: string;
  client: string;
  // Estado da padronização
  rawFormat: "Email livre" | "Planilha cliente" | "PDF NF" | "JSON API" | "Áudio/WhatsApp" | "Foto NF" | "Form Portal";
  normalization: { status: "queued" | "auto_ok" | "needs_review" | "manual" | "rejected"; confidence: number; missingFields: string[] };
  hasAttachment: boolean;
  attachmentType?: string;
}

export const INTAKE: IntakeItem[] = [
  { id: "INB-9821", channel: "Email", from: "abastecimento@heineken.com.br", subject: "Reposição chopeiras — 14 PDVs SP capital", preview: "Segue planilha em anexo (formato_heineken_v3.xlsx)…", received: "há 2 min", client: "Heineken",
    rawFormat: "Planilha cliente", normalization: { status: "needs_review", confidence: 0.78, missingFields: ["CEP destino","Janela entrega"] }, hasAttachment: true, attachmentType: "XLSX" },
  { id: "INB-9820", channel: "WhatsApp", from: "+55 11 9 8821-4410 (Bacio di Latte)", subject: "Pedido urgente — sorvete pallet mix", preview: "Áudio 0:42 — \"oi pessoal, preciso entregar amanhã 8 pallets…\"", received: "há 8 min", client: "Bacio di Latte",
    rawFormat: "Áudio/WhatsApp", normalization: { status: "manual", confidence: 0.41, missingFields: ["SKU","Endereço","Quantidade","Janela"] }, hasAttachment: true, attachmentType: "Áudio" },
  { id: "INB-9819", channel: "API/Lincros", from: "lincros.api/orders.push", subject: "Push em massa — 42 itens Nestlé", preview: "POST /orders payload validado por schema v2.1", received: "há 12 min", client: "Nestlé",
    rawFormat: "JSON API", normalization: { status: "auto_ok", confidence: 1.0, missingFields: [] }, hasAttachment: false },
  { id: "INB-9818", channel: "NF Física", from: "Recepção CD Barueri — protocolo manual", subject: "12 NFs físicas Seara — bipadas", preview: "Aguardando digitação no sistema. Romaneio em papel.", received: "há 22 min", client: "Seara",
    rawFormat: "Foto NF", normalization: { status: "queued", confidence: 0.0, missingFields: ["Tudo — pendente OCR"] }, hasAttachment: true, attachmentType: "Foto NF (12)" },
  { id: "INB-9817", channel: "Portal", from: "portal.begur/froneri", subject: "Nova OS — instalação freezer rede Carrefour", preview: "Cliente final: 8 lojas — equipamento c/ serial obrigatório", received: "há 31 min", client: "Froneri",
    rawFormat: "Form Portal", normalization: { status: "auto_ok", confidence: 1.0, missingFields: [] }, hasAttachment: false },
  { id: "INB-9816", channel: "Email", from: "logistica@solar.com.br", subject: "Reposição visa-coolers — São Paulo capital", preview: "Conforme combinado por telefone, segue lista em corpo do e-mail…", received: "há 44 min", client: "Solar Br",
    rawFormat: "Email livre", normalization: { status: "needs_review", confidence: 0.62, missingFields: ["Quantidade por destino","Serial"] }, hasAttachment: false },
  { id: "INB-9815", channel: "WhatsApp", from: "+55 41 9 7712-0033 (Metalfrio)", subject: "Equipamento com defeito — troca remessa", preview: "\"Cliente reportou que a chopeira não gela…\"", received: "há 1h", client: "Metalfrio",
    rawFormat: "Áudio/WhatsApp", normalization: { status: "needs_review", confidence: 0.55, missingFields: ["Serial original","Endereço retirada"] }, hasAttachment: false },
  { id: "INB-9814", channel: "Email", from: "operacoes@naturalone.com", subject: "Planilha semanal — 38 PDVs Sul", preview: "padrao_natural_one.xlsx — colunas diferentes da última semana", received: "há 1h", client: "Natural One",
    rawFormat: "Planilha cliente", normalization: { status: "needs_review", confidence: 0.71, missingFields: ["Mapeamento de colunas alterado"] }, hasAttachment: true, attachmentType: "XLSX" },
];

// ---------- NORMALIZAÇÃO / DE-PARA ----------
export interface MappingRule {
  client: string;
  field: string;
  clientColumn: string;
  begurField: string;
  status: "ativo" | "rascunho" | "quebrado";
  lastUsed: string;
  hits: number;
}

export const MAPPING_RULES: MappingRule[] = [
  { client: "Heineken", field: "Status", clientColumn: "STATUS_PEDIDO", begurField: "order.status", status: "ativo", lastUsed: "há 4 min", hits: 1284 },
  { client: "Heineken", field: "Quantidade", clientColumn: "QTD", begurField: "order.qty", status: "ativo", lastUsed: "há 4 min", hits: 1284 },
  { client: "Nestlé", field: "Status", clientColumn: "delivery_state", begurField: "order.status", status: "ativo", lastUsed: "há 12 min", hits: 4210 },
  { client: "Seara", field: "Endereço", clientColumn: "END_COMPLETO", begurField: "order.destination", status: "ativo", lastUsed: "há 22 min", hits: 882 },
  { client: "Natural One", field: "Quantidade", clientColumn: "qtd_cx (era QTD na sem.42)", begurField: "order.qty", status: "quebrado", lastUsed: "há 1h", hits: 0 },
  { client: "Bacio di Latte", field: "SKU", clientColumn: "—", begurField: "order.cargo", status: "rascunho", lastUsed: "—", hits: 0 },
  { client: "Solar Br", field: "Janela entrega", clientColumn: "horário (texto livre)", begurField: "order.eta", status: "rascunho", lastUsed: "—", hits: 0 },
];

export const STATUS_DEPARA = [
  { client: "Heineken",     incoming: "ENTREGUE_OK",          mapped: "delivered" },
  { client: "Heineken",     incoming: "EM_ROTA",              mapped: "in_route" },
  { client: "Nestlé",       incoming: "DELIVERED",            mapped: "delivered" },
  { client: "Nestlé",       incoming: "OUT_FOR_DELIVERY",     mapped: "in_route" },
  { client: "Seara",        incoming: "ENTREGUE PARCIAL",     mapped: "exception" },
  { client: "Seara",        incoming: "RECUSA TOTAL",         mapped: "exception" },
  { client: "Bacio",        incoming: "entregue",             mapped: "delivered" },
  { client: "Bacio",        incoming: "ENTREGUE",             mapped: "delivered" },
  { client: "Bacio",        incoming: "Entregue ✅",          mapped: "delivered" },
  { client: "Natural One",  incoming: "ENT-OK",               mapped: "delivered" },
  { client: "Solar",        incoming: "concluído",            mapped: "delivered" },
];

// ---------- HANDOFFS / WORKFLOW ----------
export interface Handoff {
  id: string;
  order: string;
  from: string;
  to: string;
  stage: Stage;
  age: string;
  blocker?: string;
  sla: "on_track" | "at_risk" | "breached";
}

export const HANDOFFS: Handoff[] = [
  { id: "H-7821", order: "BGR-248942", from: "Mesa do Analista", to: "Operador de Cross-dock", stage: "Armazém", age: "12 min", sla: "on_track" },
  { id: "H-7820", order: "BGR-248939", from: "Operador de Cross-dock", to: "Conferência", stage: "Armazém", age: "38 min", blocker: "Aguardando bipagem de serial", sla: "at_risk" },
  { id: "H-7819", order: "BGR-248930", from: "Conferência", to: "Roteirizador", stage: "Distribuição", age: "1h 12min", sla: "at_risk" },
  { id: "H-7818", order: "BGR-248921", from: "Roteirizador", to: "Líder de Doca", stage: "Expedição", age: "2h 04min", blocker: "Romaneio impresso aguardando assinatura", sla: "breached" },
  { id: "H-7817", order: "BGR-248918", from: "Líder de Doca", to: "Motorista", stage: "Transporte", age: "22 min", sla: "on_track" },
  { id: "H-7816", order: "BGR-248901", from: "Motorista", to: "Squad Monitoramento", stage: "Monitoramento", age: "8 min", blocker: "Recusa cliente — aguardando decisão", sla: "on_track" },
  { id: "H-7815", order: "BGR-248895", from: "Squad Monitoramento", to: "Mesa do Analista", stage: "Atendimento", age: "44 min", blocker: "Reagendamento pendente cliente", sla: "at_risk" },
];

// ---------- KPIs ----------
export const KPIS = [
  { label: "Entradas hoje (multicanal)", value: "184", delta: "+22", tone: "primary" },
  { label: "Pendentes triagem", value: "31", delta: "+7", tone: "warning" },
  { label: "Em separação", value: "62", delta: "−4", tone: "info" },
  { label: "Em rota", value: "147", delta: "+12", tone: "primary" },
  { label: "Entregues hoje", value: "412", delta: "+4,1%", tone: "success" },
  { label: "Ocorrências abertas", value: "23", delta: "+3", tone: "destructive" },
  { label: "Handoffs estourados", value: "9", delta: "+2", tone: "destructive" },
  { label: "OTIF (7d)", value: "94,2%", delta: "+0,4pp", tone: "success" },
];

// Backlog por etapa — alimenta Control Tower
export const BACKLOG_BY_STAGE = STAGES.map(stage => {
  const items = ORDERS.filter(o => STATUS_META[o.status].stage === stage);
  return {
    stage,
    count: items.length,
    atRisk: items.filter(o => o.sla === "at_risk").length,
    breached: items.filter(o => o.sla === "breached").length,
    owner: OWNERS_BY_STAGE[stage as Stage],
  };
});

// ---------- FROTA & MOTORISTAS ----------
export const TRIPS = [
  { id: "TRP-44218", driver: "Carlos Mendes", vehicle: "Truck Frigo MNT-4A12", stops: 12, distance: "187 km", revenue: 4280, cost: 2940, margin: 31.3, status: "Em andamento", region: "Grande SP", temp: "Refrigerado" },
  { id: "TRP-44217", driver: "Ana Ribeiro", vehicle: "VUC Frigo KLM-2D55", stops: 8, distance: "94 km", revenue: 2110, cost: 1480, margin: 29.9, status: "Em andamento", region: "ABC Paulista", temp: "Congelado" },
  { id: "TRP-44216", driver: "João Silva", vehicle: "Toco Câmara RTQ-9988", stops: 14, distance: "242 km", revenue: 5120, cost: 3640, margin: 28.9, status: "Manifesto p/ assinar (papel)", region: "Vale do Paraíba", temp: "Congelado" },
  { id: "TRP-44215", driver: "Marcos Pereira", vehicle: "Carreta Frigo BPX-1199", stops: 22, distance: "318 km", revenue: 7840, cost: 5210, margin: 33.5, status: "Carregando", region: "Litoral SP", temp: "Refrigerado" },
  { id: "TRP-44214", driver: "Lucas Almeida", vehicle: "VUC JKW-7720", stops: 10, distance: "129 km", revenue: 3280, cost: 2410, margin: 26.5, status: "Encerrada", region: "Campinas", temp: "Ambiente" },
  { id: "TRP-44213", driver: "Patrícia Souza", vehicle: "Fiorino TRC-3344", stops: 6, distance: "62 km", revenue: 1480, cost: 980, margin: 33.8, status: "Em andamento", region: "Centro SP", temp: "Ambiente" },
];

export const DRIVERS = [
  { name: "Carlos Mendes", doc: "CPF 124.***.***-09", cnh: "E", vehicle: "Truck Frigo", region: "Grande SP", trips30: 42, otif: 98.2, rating: 4.9, status: "Em viagem", type: "Agregado" },
  { name: "Ana Ribeiro",   doc: "CPF 332.***.***-12", cnh: "D", vehicle: "VUC Frigo",   region: "ABC",        trips30: 38, otif: 96.4, rating: 4.8, status: "Em viagem", type: "Frota própria" },
  { name: "João Silva",    doc: "CPF 887.***.***-44", cnh: "E", vehicle: "Toco",        region: "Vale",       trips30: 31, otif: 94.1, rating: 4.6, status: "Em viagem", type: "Agregado" },
  { name: "Marcos Pereira",doc: "CPF 221.***.***-78", cnh: "E", vehicle: "Carreta Frigo",region: "Litoral",   trips30: 27, otif: 97.0, rating: 4.7, status: "Carregando",  type: "Agregado" },
  { name: "Lucas Almeida", doc: "CPF 902.***.***-30", cnh: "D", vehicle: "VUC",         region: "Campinas",   trips30: 35, otif: 95.5, rating: 4.7, status: "Folga", type: "Frota própria" },
  { name: "Patrícia Souza",doc: "CPF 410.***.***-21", cnh: "D", vehicle: "Fiorino",     region: "Centro SP",  trips30: 44, otif: 99.1, rating: 5.0, status: "Em viagem", type: "Frota própria" },
];

// ---------- OCORRÊNCIAS — tipologia real Begur ----------
export const OCCURRENCE_TYPES = [
  "Espera 30 min",
  "Recusa total",
  "Recusa parcial",
  "Reentrega",
  "Endereço incorreto",
  "Equipamento indisponível",
  "Avaria",
  "Troca remessa/retorno",
  "Comprovante pendente",
  "Não realizado",
  "Janela perdida",
  "Cliente ausente",
] as const;

export const OCCURRENCES = [
  { id: "OCR-1184", order: "BGR-248942", type: "Espera 30 min",       severity: "medium", client: "Heineken",       reason: "PDV não tinha conferente — cobrança de espera ativada", opened: "há 12 min", owner: "Mon. Squad A", status: "Em investigação", evidence: "Foto + GPS" },
  { id: "OCR-1183", order: "BGR-248921", type: "Recusa parcial",      severity: "high",   client: "Bacio di Latte", reason: "Loja recebeu 6 de 8 pallets — câmara fria sem espaço",  opened: "há 34 min", owner: "Mon. Squad B", status: "Comunicada cliente", evidence: "Foto câmara cheia" },
  { id: "OCR-1182", order: "BGR-248908", type: "Avaria",              severity: "high",   client: "Heineken",       reason: "3 chopeiras com lacre violado — recebimento CD",       opened: "há 1h",     owner: "Qualidade",     status: "Aguardando laudo", evidence: "Fotos (8)" },
  { id: "OCR-1181", order: "BGR-248899", type: "Endereço incorreto",  severity: "low",    client: "Seara",          reason: "CEP divergente — cliente confirmou novo endereço via WA", opened: "há 2h",   owner: "Analista — A. Santos", status: "Resolvida", evidence: "Print WA" },
  { id: "OCR-1180", order: "BGR-248876", type: "Reentrega",           severity: "medium", client: "Froneri",        reason: "Loja fechada — reagendado para amanhã 09h",            opened: "há 3h",     owner: "Mon. Squad A", status: "Agendada",       evidence: "Foto fachada" },
  { id: "OCR-1179", order: "BGR-248844", type: "Equipamento indisponível", severity: "high", client: "Metalfrio",   reason: "Serial divergente do pedido — freezer HC-503 vs HC-403", opened: "há 5h",   owner: "Cross-dock",    status: "Em revisão",     evidence: "Foto etiqueta" },
  { id: "OCR-1178", order: "BGR-248831", type: "Comprovante pendente",severity: "medium", client: "Nestlé",         reason: "Motorista entregou mas não anexou foto do canhoto",    opened: "há 6h",     owner: "Mon. Squad B", status: "Cobrança motorista", evidence: "—" },
  { id: "OCR-1177", order: "BGR-248812", type: "Não realizado",       severity: "high",   client: "Solar Br",       reason: "Veículo quebrou na rota — transbordo agendado",        opened: "há 7h",     owner: "Mon. Squad A", status: "Em transbordo",  evidence: "Foto + boletim" },
];

// ---------- COMPLIANCE ----------
export const COMPLIANCE = [
  { entity: "Carlos Mendes", item: "CNH categoria E", expires: "2026-08-12", status: "ok" },
  { entity: "Carlos Mendes", item: "ASO médico", expires: "2026-05-04", status: "warning" },
  { entity: "Ana Ribeiro", item: "MOPP (transporte de cargas frigorificadas)", expires: "2026-02-18", status: "warning" },
  { entity: "Truck Frigo MNT-4A12", item: "CRLV", expires: "2026-11-30", status: "ok" },
  { entity: "Truck Frigo MNT-4A12", item: "Apólice Seguro de Carga", expires: "2026-04-30", status: "critical" },
  { entity: "VUC Frigo KLM-2D55", item: "Calibração de termógrafo", expires: "2026-05-22", status: "warning" },
  { entity: "Apólice 8821 — RCTR-C", item: "Renovação", expires: "2026-09-01", status: "ok" },
  { entity: "João Silva", item: "Verificação de antecedentes (SASSMAQ)", expires: "2026-03-10", status: "critical" },
];

// ---------- CLIENTES ----------
export const CUSTOMERS = [
  { name: "Heineken",      segment: "Bebidas",          orders30: 412, otif: 98.1, sla: "Janela 06–10h",  contract: "MSA Master 2024", contact: "abastecimento@heineken.com.br", channels: ["Email","Planilha"] },
  { name: "Nestlé",        segment: "Alimentos",        orders30: 521, otif: 97.8, sla: "24h",            contract: "Master 2025 + Lincros", contact: "logistica@nestle.com.br",      channels: ["API/Lincros"] },
  { name: "Seara",         segment: "Frigoríficos",     orders30: 298, otif: 96.4, sla: "Mesmo dia",      contract: "MSA + SOW 12",  contact: "ops@seara.com.br",          channels: ["Email","NF Física"] },
  { name: "Froneri",       segment: "Sorvetes",         orders30: 187, otif: 95.0, sla: "Janela 14–18h",  contract: "Anual 2025",     contact: "operacoes@froneri.com.br",  channels: ["Portal"] },
  { name: "Bacio di Latte",segment: "Sorvetes Premium", orders30: 132, otif: 93.2, sla: "12h",            contract: "MSA + 4 SOWs",   contact: "compras@bacio.com.br",      channels: ["WhatsApp","Email"] },
  { name: "Metalfrio",     segment: "Equipamentos refrigeração", orders30: 224, otif: 99.0, sla: "8h",     contract: "Master 2024",   contact: "supply@metalfrio.com",      channels: ["Email","WhatsApp"] },
  { name: "Solar Br",      segment: "Distribuidor Coca-Cola", orders30: 372, otif: 96.7, sla: "Janela 06–10h", contract: "MSA 2025", contact: "logistica@solar.com.br",     channels: ["Email"] },
  { name: "Natural One",   segment: "Bebidas naturais", orders30: 154, otif: 92.4, sla: "24h",            contract: "Anual 2025",    contact: "operacoes@naturalone.com",  channels: ["Email"] },
];

// ---------- HEATMAP volume ----------
export const HEATMAP = Array.from({ length: 7 * 24 }).map((_, i) => ({
  d: Math.floor(i / 24),
  h: i % 24,
  v: Math.max(0, Math.round(40 + 30 * Math.sin(i / 5) + 25 * Math.cos(i / 9) + (Math.random() * 20 - 10))),
}));

// ---------- AI (modo Visão Alvo apenas) ----------
export const AI_RECS = [
  { icon: "sparkles", title: "Reroteirizar TRP-44216 via Anchieta", body: "Economia estimada de 38 min vs Imigrantes; +R$ 220 de margem.", impact: "alta" },
  { icon: "alert",    title: "5 pedidos com risco de quebra de SLA",   body: "Cluster Zona Leste/SP — antecipar para a onda 2.",            impact: "alta" },
  { icon: "package",  title: "Consolidar 12 pacotes pequenos",          body: "Heineken + Solar — mesmo CEP destino 13050. Estimativa −R$ 410.", impact: "média" },
  { icon: "user",     title: "Patrícia subutilizada — janela 4h",       body: "Realocar 6 paradas da TRP-44213 hoje.",                       impact: "média" },
];
