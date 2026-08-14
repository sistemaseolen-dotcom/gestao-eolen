import { createServiceClient } from "@/lib/supabase/server";
import { Card, BarGroupWithModal, type DetalheRow } from "./DashboardClient";

const STATUS_COLORS: Record<string, string> = {
  aprovado: "#16a34a",
  renovar: "#2563eb",
  vencido: "#dc2626",
  pendente: "#d97706",
  nao_se_aplica: "#a3a3a3",
};
const STATUS_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  renovar: "Renovar",
  vencido: "Vencido",
  pendente: "Pendente",
  nao_se_aplica: "Não se aplica",
};
const STATUS_KEYS = ["aprovado", "renovar", "vencido", "pendente", "nao_se_aplica"];

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-[#a7332a]">{value}</p>
    </div>
  );
}

function StackedBar({
  label,
  segments,
  total,
}: {
  label: string;
  segments: { key: string; value: number }[];
  total: number;
}) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-40 shrink-0 truncate text-neutral-600" title={label}>
        {label}
      </span>
      <div className="flex h-4 flex-1 overflow-hidden rounded bg-neutral-100">
        {segments.map(
          (s) =>
            s.value > 0 && (
              <div
                key={s.key}
                style={{ width: `${(s.value / total) * 100}%`, backgroundColor: STATUS_COLORS[s.key] || "#a3a3a3" }}
                title={`${STATUS_LABELS[s.key] || s.key}: ${s.value}`}
              />
            )
        )}
      </div>
      <span className="w-10 shrink-0 text-right font-medium text-neutral-700">{total}</span>
    </div>
  );
}

function Donut({ pct, label, sublabel }: { pct: number; label: string; sublabel: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex items-center gap-6">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e5e5" strokeWidth="14" />
        <circle
          cx="65" cy="65" r={r} fill="none" stroke="#16a34a" strokeWidth="14"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)"
        />
        <text x="65" y="70" textAnchor="middle" fontSize="22" fontWeight="600" fill="#262626">
          {pct.toFixed(1)}%
        </text>
      </svg>
      <div>
        <p className="text-2xl font-semibold text-neutral-800">{label}</p>
        <p className="text-sm text-neutral-500">{sublabel}</p>
      </div>
    </div>
  );
}

function groupBy<T>(rows: T[], keyFn: (r: T) => string) {
  const map = new Map<string, T[]>();
  rows.forEach((r) => {
    const k = keyFn(r) || "Sem informação";
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(r);
  });
  return map;
}

export default async function Home() {
  const supabase = createServiceClient();

  const [
    { count: empresasAtivas },
    { count: pessoasAtivasCount },
    { data: pessoasRaw },
    { data: membrosRaw },
    { data: veiculosRaw },
    { data: treinamentosRaw },
  ] = await Promise.all([
    supabase.from("empresas").select("id", { count: "exact", head: true }).eq("status", true),
    supabase.from("pessoas").select("id", { count: "exact", head: true }).eq("status", "ATIVO"),
    supabase
      .from("pessoas")
      .select("nome, status, regional, cargos ( nome ), projetos ( nome ), operadoras ( nome ), empresas ( nome_fantasia, razao_social )")
      .eq("status", "ATIVO"),
    supabase
      .from("equipes_membros")
      .select("funcao, regional, projeto, operadora, cargo, status, pessoas ( nome ), equipes ( nome )"),
    supabase
      .from("veiculos")
      .select("placa, contrato, regional, status, pessoas ( nome ), projetos ( nome ), locadoras ( nome )")
      .not("contrato", "is", null),
    supabase.from("pessoas_treinamentos").select("tipo, status, pessoas ( nome )"),
  ]);

  const pessoas = pessoasRaw || [];
  const membros = (membrosRaw || []) as any[];
  const veiculos = (veiculosRaw || []) as any[];
  const treinamentos = (treinamentosRaw || []) as any[];

  // ---- Treinamentos por tipo ----
  const tipoMap = new Map<string, Record<string, number>>();
  let totalTreinamentos = 0;
  let totalAprovado = 0;
  const treinamentoRows: DetalheRow[] = [];
  treinamentos.forEach((t: any) => {
    const tipo = t.tipo || "Outro";
    const status = t.status || "pendente";
    if (!tipoMap.has(tipo)) tipoMap.set(tipo, {});
    const bucket = tipoMap.get(tipo)!;
    bucket[status] = (bucket[status] || 0) + 1;
    totalTreinamentos++;
    if (status === "aprovado") totalAprovado++;
    treinamentoRows.push({ nome: t.pessoas?.nome || "-", extra: `${tipo} — ${STATUS_LABELS[status] || status}` });
  });
  const tiposOrdenados = [...tipoMap.entries()]
    .map(([tipo, byStatus]) => ({ tipo, byStatus, total: Object.values(byStatus).reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);
  const pctAprovado = totalTreinamentos > 0 ? (totalAprovado / totalTreinamentos) * 100 : 0;

  // ---- Pessoas por projeto (com fallback EOLEN) ----
  const pessoaRows: DetalheRow[] = pessoas.map((p: any) => ({
    nome: p.nome,
    regional: p.regional,
    projeto: p.projetos?.nome,
    operadora: p.operadoras?.nome,
    cargo: p.cargos?.nome,
  }));
  const porProjeto = groupBy(pessoas as any[], (p: any) => p.projetos?.nome || "EOLEN");
  const projetoData = [...porProjeto.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const projetoRowsByLabel: Record<string, DetalheRow[]> = {};
  porProjeto.forEach((rows, label) => {
    projetoRowsByLabel[label] = rows.map((p: any) => ({ nome: p.nome, regional: p.regional, projeto: p.projetos?.nome, operadora: p.operadoras?.nome, cargo: p.cargos?.nome }));
  });

  // ---- Pessoas ativas por regional ----
  const porRegional = groupBy(pessoas as any[], (p: any) => p.regional || "Sem regional");
  const regionalData = [...porRegional.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const regionalRowsByLabel: Record<string, DetalheRow[]> = {};
  porRegional.forEach((rows, label) => {
    regionalRowsByLabel[label] = rows.map((p: any) => ({ nome: p.nome, regional: p.regional, projeto: p.projetos?.nome, operadora: p.operadoras?.nome, cargo: p.cargos?.nome }));
  });

  // ---- Equipes (membros ativos) por regional + projeto/operadora ----
  const membrosAtivos = membros.filter((m) => m.status);
  const equipeLabel = (m: any) => `${m.regional || "-"} ${m.projeto || m.operadora || ""}`.trim();
  const porEquipeCombo = groupBy(membrosAtivos, equipeLabel);
  const equipeComboData = [...porEquipeCombo.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const equipeComboRowsByLabel: Record<string, DetalheRow[]> = {};
  porEquipeCombo.forEach((rows, label) => {
    equipeComboRowsByLabel[label] = rows.map((m: any) => ({ nome: m.pessoas?.nome || "-", regional: m.regional, projeto: m.projeto, operadora: m.operadora, cargo: m.funcao }));
  });

  // ---- Equipes por regional ----
  const porEquipeRegional = groupBy(membrosAtivos, (m: any) => m.regional || "Sem regional");
  const equipeRegionalData = [...porEquipeRegional.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const equipeRegionalRowsByLabel: Record<string, DetalheRow[]> = {};
  porEquipeRegional.forEach((rows, label) => {
    equipeRegionalRowsByLabel[label] = rows.map((m: any) => ({ nome: m.pessoas?.nome || "-", regional: m.regional, projeto: m.projeto, operadora: m.operadora, cargo: m.funcao }));
  });

  // ---- Funções específicas (Técnico, Vistoriador, Clean-Up, Auditor) ----
  function funcaoWidget(funcaoMatch: (m: any) => boolean) {
    const rows = membrosAtivos.filter(funcaoMatch);
    const byLabel = groupBy(rows, equipeLabel);
    const data = [...byLabel.entries()].map(([label, r]) => ({ label, value: r.length })).sort((a, b) => b.value - a.value);
    const rowsByLabel: Record<string, DetalheRow[]> = {};
    byLabel.forEach((r, label) => {
      rowsByLabel[label] = r.map((m: any) => ({ nome: m.pessoas?.nome || "-", regional: m.regional, projeto: m.projeto, operadora: m.operadora, cargo: m.funcao }));
    });
    return { data, rowsByLabel };
  }
  const tecnicos = funcaoWidget((m) => (m.cargo || "").toUpperCase().includes("TÉCNIC") || (m.cargo || "").toUpperCase().includes("TECNIC"));
  const vistoriadores = funcaoWidget((m) => (m.funcao || "").toUpperCase() === "VISTORIADOR");
  const cleanup = funcaoWidget((m) => (m.funcao || "").toUpperCase().includes("CLEAN"));
  const auditores = funcaoWidget((m) => (m.funcao || "").toUpperCase().includes("AUDITOR"));

  // ---- Carros locados por regional / projeto ----
  const porCarroRegional = groupBy(veiculos, (v: any) => v.regional || "Sem regional");
  const carroRegionalData = [...porCarroRegional.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const carroRegionalRowsByLabel: Record<string, DetalheRow[]> = {};
  porCarroRegional.forEach((rows, label) => {
    carroRegionalRowsByLabel[label] = rows.map((v: any) => ({ nome: v.pessoas?.nome || v.placa || "-", regional: v.regional, projeto: v.projetos?.nome, operadora: v.locadoras?.nome, cargo: v.contrato }));
  });

  const porCarroProjeto = groupBy(veiculos, (v: any) => v.projetos?.nome || "Sem projeto");
  const carroProjetoData = [...porCarroProjeto.entries()].map(([label, rows]) => ({ label, value: rows.length })).sort((a, b) => b.value - a.value);
  const carroProjetoRowsByLabel: Record<string, DetalheRow[]> = {};
  porCarroProjeto.forEach((rows, label) => {
    carroProjetoRowsByLabel[label] = rows.map((v: any) => ({ nome: v.pessoas?.nome || v.placa || "-", regional: v.regional, projeto: v.projetos?.nome, operadora: v.locadoras?.nome, cargo: v.contrato }));
  });

  const equipesAtivasCount = new Set(membrosAtivos.map((m: any) => m.equipes?.nome).filter(Boolean)).size;

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">Dashboards</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Empresas ativas" value={empresasAtivas ?? 0} />
        <Kpi label="Pessoas ativas" value={pessoasAtivasCount ?? 0} />
        <Kpi label="Equipes ativas" value={equipesAtivasCount} />
        <Kpi label="Veículos locados" value={veiculos.length} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title={`Treinamentos (${totalTreinamentos})`} detailRows={treinamentoRows}>
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {tiposOrdenados.map((t) => (
              <StackedBar key={t.tipo} label={t.tipo} total={t.total} segments={STATUS_KEYS.map((k) => ({ key: k, value: t.byStatus[k] || 0 }))} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-600">
            {STATUS_KEYS.map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[k] }} />
                {STATUS_LABELS[k]}
              </span>
            ))}
          </div>
        </Card>

        <Card title="% de aprovação (Treinamentos)">
          <Donut pct={pctAprovado} label={`${totalAprovado} aprovados`} sublabel={`de ${totalTreinamentos} treinamentos`} />
        </Card>

        <BarGroupWithModal title="Pessoas por projeto" data={projetoData} color="#a7332a" rowsByLabel={projetoRowsByLabel} />
        <BarGroupWithModal title="Pessoas ativas por regional" data={regionalData} color="#a7332a" rowsByLabel={regionalRowsByLabel} />

        <BarGroupWithModal title="Equipes por regional/projeto" data={equipeComboData} color="#2563eb" rowsByLabel={equipeComboRowsByLabel} />
        <BarGroupWithModal title="Equipes por regional" data={equipeRegionalData} color="#2563eb" rowsByLabel={equipeRegionalRowsByLabel} />

        <BarGroupWithModal title="Técnicos" data={tecnicos.data} color="#2563eb" rowsByLabel={tecnicos.rowsByLabel} />
        <BarGroupWithModal title="Vistoriador" data={vistoriadores.data} color="#2563eb" rowsByLabel={vistoriadores.rowsByLabel} />
        <BarGroupWithModal title="Equipes Clean-Up" data={cleanup.data} color="#2563eb" rowsByLabel={cleanup.rowsByLabel} />
        <BarGroupWithModal title="Auditor de Qualidade" data={auditores.data} color="#2563eb" rowsByLabel={auditores.rowsByLabel} />

        <BarGroupWithModal title="Carros locados por regional" data={carroRegionalData} color="#a7332a" rowsByLabel={carroRegionalRowsByLabel} />
        <BarGroupWithModal title="Carros locados por projeto" data={carroProjetoData} color="#a7332a" rowsByLabel={carroProjetoRowsByLabel} />
      </div>
    </main>
  );
}
