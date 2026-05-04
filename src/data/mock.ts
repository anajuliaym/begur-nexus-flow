// Begur Control Tower — Modelo de dados centrado em Entrega (Case)

export type DeliveryStage = "solicitacao" | "preparacao" | "execucao" | "retorno" | "concluida";
export type DeliveryType = "entrega" | "coleta" | "reentrega" | "remessa";
export type OccurrenceType = "recusa" | "avaria" | "atraso" | "endereco" | "reentrega" | "equipamento";
export type Severity = "low" | "medium" | "high";

export const STAGE_META: Record<DeliveryStage, { label: string; color: string; order: number }> = {
  solicitacao: { label: "Solicitação", color: "bg-info/15 text-info border-info/30", order: 0 },
  preparacao: { label: "Preparação", color: "bg-warning/15 text-warning border-warning/30", order: 1 },
  execucao: { label: "Em Execução", color: "bg-primary/15 text-primary border-primary/30", order: 2 },
  retorno: { label: "Retorno", color: "bg-destructive/15 text-destructive border-destructive/30", order: 3 },
  concluida: { label: "Concluída", color: "bg-success/15 text-success border-success/30", order: 4 },
};

export const TYPE_LABELS: Record<DeliveryType, string> = {
  entrega: "Entrega",
  coleta: "Coleta",
  reentrega: "Reentrega",
  remessa: "Remessa",
};

export interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  type: "system" | "driver" | "analyst" | "client" | "exception";
}

export interface Occurrence {
  id: string;
  deliveryId: string;
  type: OccurrenceType;
  severity: Severity;
  description: string;
  opened: string;
  status: "aberta" | "em_analise" | "resolvida";
  owner: string;
}

export interface Delivery {
  id: string;
  client: string;
  clientContact: string;
  type: DeliveryType;
  stage: DeliveryStage;
  origin: string;
  destination: string;
  city: string;
  uf: string;
  items: { name: string; qty: number }[];
  driver?: string;
  driverPhone?: string;
  sla: string;
  slaStatus: "on_track" | "at_risk" | "breached";
  created: string;
  eta?: string;
  value: number;
  analystId: string;
  timeline: TimelineEvent[];
  occurrences: string[];
  notes?: string;
  recipientName?: string;
  feedback?: string;
}

const clients = [
  { name: "Vivo Empresas", contact: "logistica@vivo.com.br" },
  { name: "Claro NXT", contact: "ops@claro.com.br" },
  { name: "TIM Live", contact: "delivery@tim.com.br" },
  { name: "Algar Telecom", contact: "operacoes@algar.com.br" },
  { name: "Oi Soluções", contact: "compras@oi.com.br" },
  { name: "Embratel", contact: "supply@embratel.com" },
];

const cities: [string, string][] = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Campinas", "SP"], ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"],
  ["Brasília", "DF"], ["Goiânia", "GO"], ["Porto Alegre", "RS"], ["Manaus", "AM"],
];

const equip = [
  "ONT Huawei HG8245", "Roteador WiFi 6 AX1800", "Decoder 4K", "Switch 24P PoE",
  "Modem DOCSIS 3.1", "Repetidor Mesh", "STB Android TV", "ONU Nokia G-140W",
];

const drivers = [
  { name: "Carlos Mendes", phone: "+55 11 99821-4410" },
  { name: "Ana Ribeiro", phone: "+55 11 98832-1122" },
  { name: "João Silva", phone: "+55 21 97654-3210" },
  { name: "Marcos Pereira", phone: "+55 41 99876-5432" },
  { name: "Patrícia Souza", phone: "+55 11 91234-5678" },
  { name: "Lucas Almeida", phone: "+55 19 98765-4321" },
];

const stages: DeliveryStage[] = ["solicitacao", "solicitacao", "preparacao", "preparacao", "execucao", "execucao", "execucao", "retorno", "concluida", "concluida", "concluida", "concluida"];
const types: DeliveryType[] = ["entrega", "entrega", "entrega", "coleta", "reentrega", "remessa"];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

function makeTimeline(stage: DeliveryStage, i: number): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { time: "08:12", title: "Solicitação recebida", description: "Via e-mail do cliente", type: "system" },
  ];
  if (stage === "solicitacao") return base;
  base.push(
    { time: "09:30", title: "Dados conferidos", description: "Endereço e itens validados pelo analista", type: "analyst" },
    { time: "10:15", title: "Roteirização concluída", description: `Incluída na viagem TRP-${44200 + i}`, type: "system" },
  );
  if (stage === "preparacao") return base;
  base.push(
    { time: "11:00", title: "Saiu para entrega", description: "Motorista confirmou partida do CD", type: "driver" },
    { time: "13:42", title: "Chegou ao local", description: "GPS confirmado no endereço", type: "driver" },
  );
  if (stage === "execucao") return base;
  if (stage === "retorno") {
    base.push({ time: "14:00", title: "Tentativa sem sucesso", description: "Cliente ausente no local", type: "exception" });
    return base;
  }
  base.push(
    { time: "14:05", title: "Entregue com sucesso", description: "Recebido por João Pedro", type: "driver" },
    { time: "14:10", title: "Comprovante registrado", description: "Foto e assinatura digital", type: "system" },
    { time: "15:00", title: "Caso encerrado", description: "Feedback positivo do cliente", type: "analyst" },
  );
  return base;
}

export const DELIVERIES: Delivery[] = Array.from({ length: 32 }).map((_, i) => {
  const client = rand(clients, i);
  const [city, uf] = rand(cities, i * 3);
  const stage = rand(stages, i);
  const type = rand(types, i);
  const driver = (stage === "execucao" || stage === "retorno" || stage === "concluida") ? rand(drivers, i) : undefined;
  const slaStatus = i % 11 === 0 ? "breached" : i % 7 === 0 ? "at_risk" : "on_track";

  return {
    id: `BGR-${(100 + i).toString().padStart(4, "0")}`,
    client: client.name,
    clientContact: client.contact,
    type,
    stage,
    origin: "CD Begur — Barueri/SP",
    destination: `Rua das Flores, 420 — ${city}/${uf}`,
    city,
    uf,
    items: [
      { name: rand(equip, i), qty: 1 + (i % 5) },
      { name: rand(equip, i + 3), qty: 1 + (i % 3) },
    ],
    driver: driver?.name,
    driverPhone: driver?.phone,
    sla: ["4h", "6h", "12h", "24h", "Mesmo dia"][i % 5],
    slaStatus,
    created: ["há 10 min", "há 30 min", "há 1h", "há 2h", "há 4h", "Ontem", "há 2 dias"][i % 7],
    eta: stage === "execucao" ? ["14:30", "15:45", "16:20", "17:00"][i % 4] : undefined,
    value: 480 + (i * 137) % 4200,
    analystId: ["renata", "marcos", "carla"][i % 3],
    timeline: makeTimeline(stage, i),
    occurrences: stage === "retorno" ? [`OCR-${1100 + i}`] : [],
    recipientName: stage === "concluida" ? "João Pedro" : undefined,
    feedback: stage === "concluida" && i % 3 === 0 ? "Entrega rápida e sem problemas. Obrigado!" : undefined,
  };
});

export const OCCURRENCES_DATA: Occurrence[] = [
  { id: "OCR-1100", deliveryId: "BGR-0107", type: "recusa", severity: "high", description: "Cliente ausente — segunda tentativa", opened: "há 12 min", status: "aberta", owner: "Renata Moura" },
  { id: "OCR-1101", deliveryId: "BGR-0115", type: "atraso", severity: "medium", description: "Tráfego intenso na Marginal Pinheiros", opened: "há 34 min", status: "em_analise", owner: "Marcos Silva" },
  { id: "OCR-1102", deliveryId: "BGR-0103", type: "avaria", severity: "high", description: "Embalagem violada na recepção do CD", opened: "há 1h", status: "aberta", owner: "Carla Santos" },
  { id: "OCR-1103", deliveryId: "BGR-0119", type: "endereco", severity: "low", description: "CEP divergente — novo endereço confirmado pelo cliente", opened: "há 2h", status: "resolvida", owner: "Renata Moura" },
  { id: "OCR-1104", deliveryId: "BGR-0108", type: "reentrega", severity: "medium", description: "Reagendado para amanhã às 09:00", opened: "há 3h", status: "em_analise", owner: "Marcos Silva" },
  { id: "OCR-1105", deliveryId: "BGR-0121", type: "equipamento", severity: "high", description: "Serial divergente do pedido — conferência necessária", opened: "há 5h", status: "aberta", owner: "Carla Santos" },
  { id: "OCR-1106", deliveryId: "BGR-0112", type: "recusa", severity: "medium", description: "Endereço comercial fechado no horário", opened: "há 6h", status: "em_analise", owner: "Renata Moura" },
  { id: "OCR-1107", deliveryId: "BGR-0125", type: "atraso", severity: "low", description: "Veículo com pneu furado — substituição em andamento", opened: "há 8h", status: "resolvida", owner: "Marcos Silva" },
];

export interface AnalystData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  clients: string[];
  stats: {
    abertas: number;
    emExecucao: number;
    concluidas: number;
    ocorrencias: number;
    slaAtRisk: number;
  };
}

export const ANALYSTS: AnalystData[] = [
  {
    id: "renata",
    name: "Renata Moura",
    role: "Analista Sênior",
    avatar: "RM",
    clients: ["Vivo Empresas", "Algar Telecom"],
    stats: { abertas: 8, emExecucao: 14, concluidas: 127, ocorrencias: 3, slaAtRisk: 2 },
  },
  {
    id: "marcos",
    name: "Marcos Silva",
    role: "Analista Pleno",
    avatar: "MS",
    clients: ["Claro NXT", "Oi Soluções"],
    stats: { abertas: 5, emExecucao: 11, concluidas: 98, ocorrencias: 2, slaAtRisk: 1 },
  },
  {
    id: "carla",
    name: "Carla Santos",
    role: "Analista Pleno",
    avatar: "CS",
    clients: ["TIM Live", "Embratel"],
    stats: { abertas: 6, emExecucao: 9, concluidas: 112, ocorrencias: 4, slaAtRisk: 0 },
  },
];

export const CUSTOMERS = [
  { name: "Vivo Empresas", segment: "Telecom B2B", orders30: 412, otif: 98.1, sla: "4h", contact: "logistica@vivo.com.br" },
  { name: "Claro NXT", segment: "Telecom B2B", orders30: 298, otif: 96.4, sla: "6h", contact: "ops@claro.com.br" },
  { name: "TIM Live", segment: "Residencial", orders30: 521, otif: 97.8, sla: "Mesmo dia", contact: "delivery@tim.com.br" },
  { name: "Algar Telecom", segment: "Telecom Regional", orders30: 187, otif: 95.0, sla: "24h", contact: "operacoes@algar.com.br" },
  { name: "Oi Soluções", segment: "Telecom B2B", orders30: 132, otif: 93.2, sla: "12h", contact: "compras@oi.com.br" },
  { name: "Embratel", segment: "Enterprise", orders30: 224, otif: 99.0, sla: "8h", contact: "supply@embratel.com" },
];
