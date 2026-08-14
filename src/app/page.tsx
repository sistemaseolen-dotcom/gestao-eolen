import { createServiceClient } from "@/lib/supabase/server";

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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-neutral-700">{title}</h2>
      {children}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-[#a7332a]">{value}</p>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-40 shrink-0 truncate text-neutral-600" title={label}>
        {label}
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-neutral-100">
        <div className="h-4 rounded" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 shrink-0 text-right font-medium text-neutral-700">{value}</span>
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
                style={{
                  width: `${(s.value / total) * 100}%`,
                  backgroundColor: STATUS_COLORS[s.key] || "#a3a3a3",
                }}
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
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="#16a34a"
          strokeWidth="14"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
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

export default async function Home() {
  const supabase = createServiceClient();

  const [
    { count: empresasAtivas },
    { count: pessoasAtivas },
    { count: equipesCount },
    { count: veiculosLocados },
    { data: treinamentosRaw },
    { data: veiculosRegionalRaw },
    { data: veiculosProjetoRaw },
  ] = await Promise.all([
    supabase.from("empresas").select("id", { count: "exact", head: true }).eq("status", true),
    supabase.from("pessoas").select("id", { count: "exact", head: true }).eq("status", "ATIVO"),
    supabase.from("equipes").select("id", { count: "exact", head: true }),
    supabase.from("veiculos").select("id", { count: "exact", head: true }).not("contrato", "is", null),
    supabase.from("pessoas_treinamentos").select("tipo, status"),
    supabase.from("veiculos").select("regional").not("contrato", "is", null),
    supabase.from("veiculos").select("projetos ( nome )").not("contrato", "is", null),
  ]);

  // Treinamentos por tipo x status
  const tipoMap = new Map<string, Record<string, number>>();
  let totalTreinamentos = 0;
  let totalAprovado = 0;
  (treinamentosRaw || []).forEach((t: any) => {
    const tipo = t.tipo || "Outro";
    const status = t.status || "pendente";
    if (!tipoMap.has(tipo)) tipoMap.set(tipo, {});
    const bucket = tipoMap.get(tipo)!;
    bucket[status] = (bucket[status] || 0) + 1;
    totalTreinamentos++;
    if (status === "aprovado") totalAprovado++;
  });
  const tiposOrdenados = [...tipoMap.entries()]
    .map(([tipo, byStatus]) => ({
      tipo,
      byStatus,
      total: Object.values(byStatus).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);
  const statusKeys = ["aprovado", "renovar", "vencido", "pendente", "nao_se_aplica"];

  // Carros locados por regional
  const regionalCounts = new Map<string, number>();
  (veiculosRegionalRaw || []).forEach((v: any) => {
    const key = v.regional || "Sem regional";
    regionalCounts.set(key, (regionalCounts.get(key) || 0) + 1);
  });
  const regionalRows = [...regionalCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxRegional = Math.max(1, ...regionalRows.map((r) => r[1]));

  // Carros locados por projeto
  const projetoCounts = new Map<string, number>();
  (veiculosProjetoRaw || []).forEach((v: any) => {
    const key = v.projetos?.nome || "Sem projeto";
    projetoCounts.set(key, (projetoCounts.get(key) || 0) + 1);
  });
  const projetoRows = [...projetoCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxProjeto = Math.max(1, ...projetoRows.map((r) => r[1]));

  const pctAprovado = totalTreinamentos > 0 ? (totalAprovado / totalTreinamentos) * 100 : 0;

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">Dashboards</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Empresas ativas" value={empresasAtivas ?? 0} />
        <Kpi label="Pessoas ativas" value={pessoasAtivas ?? 0} />
        <Kpi label="Equipes" value={equipesCount ?? 0} />
        <Kpi label="Veículos locados" value={veiculosLocados ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title={`Treinamentos por tipo (${totalTreinamentos})`}>
          <div className="space-y-2">
            {tiposOrdenados.map((t) => (
              <StackedBar
                key={t.tipo}
                label={t.tipo}
                total={t.total}
                segments={statusKeys.map((k) => ({ key: k, value: t.byStatus[k] || 0 }))}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-600">
            {statusKeys.map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[k] }} />
                {STATUS_LABELS[k]}
              </span>
            ))}
          </div>
        </Card>

        <Card title="% de aprovação">
          <Donut pct={pctAprovado} label={`${totalAprovado} aprovados`} sublabel={`de ${totalTreinamentos} treinamentos`} />
        </Card>

        <Card title={`Carros locados por regional (${veiculosLocados ?? 0})`}>
          <div className="space-y-2">
            {regionalRows.map(([label, value]) => (
              <BarRow key={label} label={label} value={value} max={maxRegional} color="#a7332a" />
            ))}
            {regionalRows.length === 0 && <p className="text-sm text-neutral-500">Sem dados.</p>}
          </div>
        </Card>

        <Card title={`Carros locados por projeto (${veiculosLocados ?? 0})`}>
          <div className="space-y-2">
            {projetoRows.map(([label, value]) => (
              <BarRow key={label} label={label} value={value} max={maxProjeto} color="#2563eb" />
            ))}
            {projetoRows.length === 0 && <p className="text-sm text-neutral-500">Sem dados.</p>}
          </div>
        </Card>
      </div>
    </main>
  );
}
