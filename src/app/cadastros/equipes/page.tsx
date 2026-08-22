import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteEquipe } from "./actions";
import DeleteButton from "@/components/DeleteButton";

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

function StatusDot({ status }: { status: boolean | null }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}
      title={status ? "Ativo" : "Inativo"}
    />
  );
}

function pageWindow(current: number, total: number) {
  const span = 3;
  let start = Math.max(1, current - 1);
  let end = Math.min(total, start + span);
  start = Math.max(1, end - span);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export default async function EquipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const status = (params.status || "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  let query = supabase
    .from("equipes")
    .select(
      `id, nome, status, regional,
       pessoas!equipes_team_leader_id_fkey ( nome ),
       projetos ( nome ),
       operadoras ( nome )`,
      { count: "exact" }
    )
    .order("nome")
    .range(from, to);

  if (q) query = query.ilike("nome", `%${q}%`);
  if (status) query = query.eq("status", status === "ativo");

  const { data: equipes, count, error } = await query;
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const pages = pageWindow(page, totalPages);
  const linkFor = (p: number) =>
    `/cadastros/equipes?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(status ? { status } : {}),
      page: String(p),
    })}`;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Equipes</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <Link href="/cadastros/equipes/novo" className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
          + Inserir
        </Link>
        <form action="/cadastros/equipes" className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span>Status</span>
          <select
            name="status"
            defaultValue={status}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span>Buscar por nome</span>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]">
            Filtrar
          </button>
          {(q || status) && <Link href="/cadastros/equipes" className="text-neutral-500 hover:underline">limpar</Link>}
        </form>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Erro: {error.message}</p>}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium text-neutral-500">Nome</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Team líder</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Projeto</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Operadora</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Regional</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(equipes || []).map((eq: any) => (
              <tr key={eq.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <StatusDot status={eq.status} />
                </td>
                <td className="px-4 py-3 font-medium text-[#a7332a]">{eq.nome}</td>
                <td className="px-4 py-3 text-neutral-600">{eq.pessoas?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{eq.projetos?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{eq.operadoras?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{eq.regional || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Link href={`/cadastros/equipes/${eq.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteEquipe(eq.id);
                      }}
                      confirmMessage={`Excluir ${eq.nome}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (equipes || []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">Nenhuma equipe encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
        <span>{count ?? 0} equipe(s) · Página {page} de {totalPages}</span>
        <div className="flex items-center gap-1">
          <Link href={linkFor(Math.max(1, page - 1))} className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}>Ant</Link>
          {pages[0] > 1 && <span className="px-1">…</span>}
          {pages.map((p) => (
            <Link key={p} href={linkFor(p)} className={`rounded-md px-2.5 py-1 ${p === page ? "bg-[#a7332a] text-white" : "border border-neutral-300 hover:bg-neutral-50"}`}>{p}</Link>
          ))}
          {pages[pages.length - 1] < totalPages && <span className="px-1">…</span>}
          <Link href={linkFor(Math.min(totalPages, page + 1))} className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}>Seg</Link>
        </div>
      </div>
    </main>
  );
}
