// Begur Control Tower — Modelo de dados centrado em Entrega (Case)
// Serviços Begur: Cross Docking, Armazenagem, Separação/Kits, Movimentação/Positivação,
// Logística Reversa, Distribuição Nacional, Gestão de Fretes, Rastreamento de Entregas

export type DeliveryStage = "solicitacao" | "crossdocking" | "preparacao" | "execucao" | "concluida";
export type DeliveryType = "entrega" | "coleta" | "reentrega" | "remessa";
export type OccurrenceType = "recusa" | "avaria" | "atraso" | "endereco" | "reentrega" | "equipamento";
export type Severity = "low" | "medium" | "high";
export type RequestChannel = "email" | "whatsapp" | "manual" | "api";
export type RequestStatus = "pendente" | "em_analise" | "convertida" | "recusada";

export const STAGE_META: Record<DeliveryStage, { label: string; color: string; order: number }> = {
  solicitacao: { label: "Solicitação", color: "bg-info/15 text-info border-info/30", order: 0 },
  crossdocking: { label: "Cross-Docking", color: "bg-warning/15 text-warning border-warning/30", order: 1 },
  preparacao: { label: "Preparação", color: "bg-accent-foreground/15 text-accent-foreground border-accent-foreground/30", order: 2 },
  execucao: { label: "Em Execução", color: "bg-primary/15 text-primary border-primary/30", order: 3 },
  concluida: { label: "Concluída", color: "bg-success/15 text-success border-success/30", order: 4 },
};

export const TYPE_LABELS: Record<DeliveryType, string> = {
  entrega: "Entrega",
  coleta: "Coleta",
  reentrega: "Reentrega",
  remessa: "Remessa",
};

export const CHANNEL_META: Record<RequestChannel, { label: string; color: string }> = {
  email: { label: "E-mail", color: "bg-info/15 text-info border-info/30" },
  whatsapp: { label: "WhatsApp", color: "bg-success/15 text-success border-success/30" },
  manual: { label: "Manual", color: "bg-primary/15 text-primary border-primary/30" },
  api: { label: "API", color: "bg-warning/15 text-warning border-warning/30" },
};

export const REQUEST_STATUS_META: Record<RequestStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning/15 text-warning border-warning/30" },
  em_analise: { label: "Em análise", color: "bg-info/15 text-info border-info/30" },
  convertida: { label: "Convertida", color: "bg-success/15 text-success border-success/30" },
  recusada: { label: "Recusada", color: "bg-destructive/15 text-destructive border-destructive/30" },
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

export interface ServiceRequest {
  id: string;
  channel: RequestChannel;
  status: RequestStatus;
  client: string;
  subject: string;
  preview: string;
  fullBody: string;
  senderName: string;
  senderEmail: string;
  receivedAt: string;
  items: { name: string; qty: number }[];
  destination?: string;
  notes?: string;
  convertedTo?: string;
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

// Begur's real clients
const clients = [
  { name: "3L", contact: "logistica@3l.com.br" },
  { name: "Bacio di Latte", contact: "ops@baciodilatte.com.br" },
  { name: "Froneri", contact: "supply@froneri.com.br" },
  { name: "Heineken", contact: "logistica@heineken.com.br" },
  { name: "Metalfrio T1", contact: "operacoes.t1@metalfrio.com.br" },
  { name: "Metalfrio T2", contact: "operacoes.t2@metalfrio.com.br" },
  { name: "Natural One", contact: "entregas@naturalone.com.br" },
  { name: "Nestlé", contact: "supply.chain@nestle.com.br" },
  { name: "Seara", contact: "logistica@seara.com.br" },
  { name: "Solar", contact: "distribuicao@solar.com.br" },
];

const cities: [string, string][] = [
  ["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Campinas", "SP"], ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"],
  ["Brasília", "DF"], ["Goiânia", "GO"], ["Porto Alegre", "RS"], ["Manaus", "AM"],
];

const equip = [
  "Freezer Metalfrio VF55", "Freezer Horizontal Metalfrio DA420", "Refrigerador Vertical Metalfrio VB28",
  "Cooler Metalfrio CL200", "Freezer Expositor Metalfrio VF50F", "Geladeira Comercial Metalfrio VN44",
  "Cervejeira Metalfrio VN50", "Freezer Ilha Metalfrio NF40", "Refrigerador Solar 440L",
  "Expositor Refrigerado Froneri EF300", "Freezer Vertical Nestlé FV120", "Ilha Refrigerada Solar IR200",
];

const drivers = [
  { name: "Carlos Mendes", phone: "+55 11 99821-4410" },
  { name: "Ana Ribeiro", phone: "+55 11 98832-1122" },
  { name: "João Silva", phone: "+55 21 97654-3210" },
  { name: "Marcos Pereira", phone: "+55 41 99876-5432" },
  { name: "Patrícia Souza", phone: "+55 11 91234-5678" },
  { name: "Lucas Almeida", phone: "+55 19 98765-4321" },
];

const stages: DeliveryStage[] = ["solicitacao", "solicitacao", "crossdocking", "crossdocking", "preparacao", "preparacao", "execucao", "execucao", "execucao", "concluida", "concluida", "concluida"];
const types: DeliveryType[] = ["entrega", "entrega", "entrega", "coleta", "reentrega", "remessa"];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

function makeTimeline(stage: DeliveryStage, i: number): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { time: "08:12", title: "Solicitação recebida", description: "Via e-mail do cliente", type: "system" },
  ];
  if (stage === "solicitacao") return base;
  base.push(
    { time: "09:30", title: "Cross-docking — Análise de frete", description: "Cotação e conferência de carga no CD", type: "analyst" },
    { time: "10:00", title: "Consolidação concluída", description: "Carga consolidada e conferida", type: "system" },
    { time: "10:15", title: "Roteirização concluída", description: `Incluída na viagem TRP-${44200 + i}`, type: "system" },
  );
  if (stage === "crossdocking") return base;
  base.push(
    { time: "10:45", title: "Separação e carregamento", description: "Equipamentos separados e carregados no veículo", type: "analyst" },
    { time: "11:00", title: "Inspeção de carga", description: "Registro fotográfico e conferência final", type: "system" },
  );
  if (stage === "preparacao") return base;
  base.push(
    { time: "11:30", title: "Saiu para entrega", description: "Motorista confirmou partida do CD", type: "driver" },
    { time: "13:42", title: "Chegou ao local", description: "GPS confirmado no endereço", type: "driver" },
  );
  if (stage === "execucao") return base;
  base.push(
    { time: "14:05", title: "Entregue com sucesso", description: "Recebido por João Pedro", type: "driver" },
    { time: "14:10", title: "Comprovante registrado", description: "Foto e assinatura digital", type: "system" },
    { time: "14:30", title: "Feedback do cliente", description: "Avaliação positiva registrada", type: "client" },
    { time: "15:00", title: "Caso encerrado", description: "Concluído pelo analista", type: "analyst" },
  );
  return base;
}

export const DELIVERIES: Delivery[] = Array.from({ length: 32 }).map((_, i) => {
  const client = rand(clients, i);
  const [city, uf] = rand(cities, i * 3);
  const stage = rand(stages, i);
  const type = rand(types, i);
  const driver = (stage === "preparacao" || stage === "execucao" || stage === "concluida") ? rand(drivers, i) : undefined;
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
    occurrences: [],
    recipientName: stage === "concluida" ? "João Pedro" : undefined,
    feedback: stage === "concluida" && i % 3 === 0 ? "Entrega rápida e sem problemas. Obrigado!" : undefined,
  };
});

// Service Requests (Solicitações)
const requestChannels: RequestChannel[] = ["email", "email", "whatsapp", "email", "api", "whatsapp", "email", "manual"];
const requestStatuses: RequestStatus[] = ["pendente", "pendente", "em_analise", "convertida", "pendente", "em_analise", "recusada", "convertida"];

export const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "SOL-0001",
    channel: "email",
    status: "pendente",
    client: "Heineken",
    subject: "Solicitação de coleta urgente — 15 freezers Lote 4421",
    preview: "Prezados, precisamos agendar a coleta de 15 freezers expositores no CD Jacareí…",
    fullBody: `Prezados,

Precisamos agendar a coleta de 15 freezers expositores no CD Jacareí para amanhã, 05/05.

Detalhes:
- Equipamento: Freezer Expositor Metalfrio VF50F
- Quantidade: 15 unidades
- Local de coleta: CD Jacareí — Rod. Presidente Dutra, km 160
- Janela: 08:00 às 12:00
- Destino: CD Begur Barueri
- Contato local: Fernando Alves (11) 99887-2233

Favor confirmar disponibilidade de veículo com plataforma elevatória.

Atenciosamente,
Marina Costa
Coord. Logística — Heineken Brasil`,
    senderName: "Marina Costa",
    senderEmail: "marina.costa@heineken.com.br",
    receivedAt: "há 15 min",
    items: [{ name: "Freezer Expositor Metalfrio VF50F", qty: 15 }],
    destination: "CD Begur — Barueri/SP",
  },
  {
    id: "SOL-0002",
    channel: "whatsapp",
    status: "pendente",
    client: "Bacio di Latte",
    subject: "Reposição freezers loja Jardins",
    preview: "Oi Begur! Preciso de 3 freezers pra loja Jardins. 2 expositores verticais e 1 ilha…",
    fullBody: `Oi Begur! Preciso de reposição de freezers pra loja Jardins.

2 Expositores Refrigerados Froneri EF300
1 Freezer Ilha Metalfrio NF40

Entregar amanhã de manhã, até 10h. Precisa de instalação no local.

Endereço: Rua Oscar Freire, 890 — Jardins/SP
Contato: Juliana (loja) — (11) 98765-1234

Obrigada!
Camila Ferreira — Bacio di Latte`,
    senderName: "Camila Ferreira",
    senderEmail: "camila@baciodilatte.com.br",
    receivedAt: "há 25 min",
    items: [{ name: "Expositor Refrigerado Froneri EF300", qty: 2 }, { name: "Freezer Ilha Metalfrio NF40", qty: 1 }],
    destination: "Rua Oscar Freire, 890 — São Paulo/SP",
  },
  {
    id: "SOL-0003",
    channel: "email",
    status: "em_analise",
    client: "Seara",
    subject: "Entrega programada — Freezers horizontais para PDVs",
    preview: "Conforme contrato mensal, segue pedido de 20 freezers horizontais DA420 para distribuição…",
    fullBody: `Conforme contrato mensal, segue pedido de 20 freezers horizontais Metalfrio DA420 para distribuição em 5 pontos na Grande SP.

Pedido: PED-88431
Data de entrega: 06/05/2026
Equipamento: Freezer Horizontal Metalfrio DA420

Pontos de entrega:
1. Atacadão Osasco — 5 un
2. Assaí Guarulhos — 4 un
3. Makro Santo André — 3 un
4. Atacadão Campinas — 5 un
5. Assaí Sorocaba — 3 un

Favor confirmar agendamento e veículos com plataforma.

Ricardo Mendes
Gestão de Equipamentos — Seara/JBS`,
    senderName: "Ricardo Mendes",
    senderEmail: "ricardo.mendes@seara.com.br",
    receivedAt: "há 1h",
    items: [{ name: "Freezer Horizontal Metalfrio DA420", qty: 20 }],
    destination: "Múltiplos pontos — Grande SP",
  },
  {
    id: "SOL-0004",
    channel: "email",
    status: "convertida",
    client: "Nestlé",
    subject: "RE: Transferência freezers verticais — CD Cajamar → CD Begur",
    preview: "Confirmamos o envio de 8 freezers verticais Nestlé FV120 para transferência…",
    fullBody: `Confirmamos o envio de 8 freezers verticais Nestlé FV120 para transferência do CD Cajamar para CD Begur.

NF: 44521
Peso total: 1.200kg
Paletizado: Não (equipamentos individuais com embalagem protetora)
Saída prevista: 05/05 às 14:00

Att,
Paulo Barros
Supply Chain — Nestlé Brasil`,
    senderName: "Paulo Barros",
    senderEmail: "paulo.barros@nestle.com.br",
    receivedAt: "há 2h",
    items: [{ name: "Freezer Vertical Nestlé FV120", qty: 8 }],
    destination: "CD Begur — Barueri/SP",
    convertedTo: "BGR-0132",
  },
  {
    id: "SOL-0005",
    channel: "api",
    status: "pendente",
    client: "Natural One",
    subject: "Pedido automático — Refrigeradores para PDVs (lote semanal)",
    preview: "Pedido gerado automaticamente via integração. 12 refrigeradores verticais VB28…",
    fullBody: `[Pedido automático via API — Natural One]

Pedido: AUTO-7832
Equipamento: Refrigerador Vertical Metalfrio VB28
Quantidade: 12 unidades
Destino: CD Atacadão Interlagos
Prazo: D+2
Observação: Equipamentos para campanha promocional em PDVs

Gerado em: 05/05/2026 07:45:00`,
    senderName: "Sistema Natural One",
    senderEmail: "api@naturalone.com.br",
    receivedAt: "há 3h",
    items: [{ name: "Refrigerador Vertical Metalfrio VB28", qty: 12 }],
    destination: "CD Atacadão Interlagos — São Paulo/SP",
  },
  {
    id: "SOL-0006",
    channel: "whatsapp",
    status: "em_analise",
    client: "Metalfrio T1",
    subject: "Instalação de freezer — cliente novo em Campinas",
    preview: "Begur, temos uma instalação de freezer VF55 em Campinas. Cliente novo…",
    fullBody: `Begur, temos uma instalação de freezer VF55 em Campinas. Cliente novo, precisa ser instalado até sexta.

Equipamento: Freezer Metalfrio VF55
Endereço: Av. Norte Sul, 1200 — Campinas/SP
Contato: Sr. Alberto — (19) 99876-5432
Observação: Precisa de 2 ajudantes para descarga

Thiago Nunes — Metalfrio Operações T1`,
    senderName: "Thiago Nunes",
    senderEmail: "thiago.nunes@metalfrio.com.br",
    receivedAt: "há 4h",
    items: [{ name: "Freezer Metalfrio VF55", qty: 1 }],
    destination: "Av. Norte Sul, 1200 — Campinas/SP",
  },
  {
    id: "SOL-0007",
    channel: "email",
    status: "recusada",
    client: "Solar",
    subject: "Cotação para rota Fortaleza-Teresina — Ilhas refrigeradas",
    preview: "Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição de ilhas refrigeradas…",
    fullBody: `Gostaríamos de cotar uma rota fixa semanal Fortaleza-Teresina para distribuição de ilhas refrigeradas.

Volume estimado: 30 ilhas/semana
Rota: Fortaleza/CE → Teresina/PI (aprox. 630km)
Equipamento: Ilha Refrigerada Solar IR200
Peso unitário: 85kg

Aguardamos proposta comercial.

Fernanda Lima
Diretora de Logística — Solar Br`,
    senderName: "Fernanda Lima",
    senderEmail: "fernanda.lima@solar.com.br",
    receivedAt: "há 6h",
    items: [{ name: "Ilha Refrigerada Solar IR200", qty: 30 }],
    destination: "Teresina/PI",
    notes: "Fora do escopo operacional atual — encaminhado ao comercial",
  },
  {
    id: "SOL-0008",
    channel: "manual",
    status: "convertida",
    client: "Froneri",
    subject: "Cadastro manual — Reentrega expositor danificado",
    preview: "Reentrega de 2 expositores refrigerados Froneri EF300 devolvidos por avaria no transporte…",
    fullBody: `Cadastro manual pelo analista.

Motivo: Reentrega de 2 expositores refrigerados Froneri EF300 devolvidos por avaria no transporte.
Cliente destino: Supermercado Pão de Açúcar — Moema/SP
Prazo: Mesmo dia
Observação: Equipamentos revisados e testados no CD. Funcionamento OK.`,
    senderName: "Renata Moura (Analista)",
    senderEmail: "renata.moura@begur.com.br",
    receivedAt: "há 8h",
    items: [{ name: "Expositor Refrigerado Froneri EF300", qty: 2 }],
    destination: "Pão de Açúcar Moema — São Paulo/SP",
    convertedTo: "BGR-0128",
  },
];

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
    clients: ["Heineken", "Bacio di Latte", "Froneri"],
    stats: { abertas: 8, emExecucao: 14, concluidas: 127, ocorrencias: 3, slaAtRisk: 2 },
  },
  {
    id: "marcos",
    name: "Marcos Silva",
    role: "Analista Pleno",
    avatar: "MS",
    clients: ["Nestlé", "Seara", "Natural One"],
    stats: { abertas: 5, emExecucao: 11, concluidas: 98, ocorrencias: 2, slaAtRisk: 1 },
  },
  {
    id: "carla",
    name: "Carla Santos",
    role: "Analista Pleno",
    avatar: "CS",
    clients: ["Metalfrio T1", "Metalfrio T2", "3L", "Solar"],
    stats: { abertas: 6, emExecucao: 9, concluidas: 112, ocorrencias: 4, slaAtRisk: 0 },
  },
];

export const CUSTOMERS = [
  { name: "3L", segment: "Refrigeração Comercial", orders30: 187, otif: 96.2, sla: "12h", contact: "logistica@3l.com.br" },
  { name: "Bacio di Latte", segment: "Freezers/Expositores", orders30: 312, otif: 98.5, sla: "4h", contact: "ops@baciodilatte.com.br" },
  { name: "Froneri", segment: "Expositores Refrigerados", orders30: 298, otif: 97.1, sla: "6h", contact: "supply@froneri.com.br" },
  { name: "Heineken", segment: "Cervejeiras/Freezers", orders30: 521, otif: 98.8, sla: "6h", contact: "logistica@heineken.com.br" },
  { name: "Metalfrio T1", segment: "Equipamentos Refrigerados", orders30: 145, otif: 94.5, sla: "24h", contact: "operacoes.t1@metalfrio.com.br" },
  { name: "Metalfrio T2", segment: "Equipamentos Refrigerados", orders30: 98, otif: 95.0, sla: "24h", contact: "operacoes.t2@metalfrio.com.br" },
  { name: "Natural One", segment: "Refrigeradores PDV", orders30: 267, otif: 97.8, sla: "Mesmo dia", contact: "entregas@naturalone.com.br" },
  { name: "Nestlé", segment: "Freezers Verticais", orders30: 412, otif: 99.0, sla: "8h", contact: "supply.chain@nestle.com.br" },
  { name: "Seara", segment: "Freezers Horizontais", orders30: 378, otif: 96.4, sla: "12h", contact: "logistica@seara.com.br" },
  { name: "Solar", segment: "Ilhas Refrigeradas", orders30: 445, otif: 97.3, sla: "12h", contact: "distribuicao@solar.com.br" },
];
