import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deletePessoa } from "./actions";
import DeleteButton from "@/components/DeleteButton";

const PAGE_SIZE = 10;

function StatusDot({ status }: { status: string | null }) {
  const isAtivo = (status || "").toLowerCase() === "ativo";
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${isAtivo ? "bg-green-500" : "bg-red-500"}`}
      title={status || "-"}
    />
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3 text-neutral-400">
      <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 font-medium text-neutral-500">
      <span className="flex items-center gap-1">
        {children}
        <ChevronDown />
      </span>
    </th>
  );
}

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
    >
      {children}
    </button>
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

export default async function PessoasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const status = (params.status || "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  let query = supabase
    .from("pessoas")
    .select(
      `id, nome, status, regional, estado_servico, numero_registro, data_admissao, cpf,
       empresas ( razao_social, nome_fantasia ),
       cargos ( nome ),
       projetos ( nome ),
       operadoras ( nome ),
       equipes!pessoas_equipe_id_fkey ( nome )`,
      { count: "exact" }
    )
    .order("nome", { ascending: true })
    .range(from, to);

  if (q) {
    query = query.ilike("nome", `%${q}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data: pessoas, count, error } = await query;
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const pages = pageWindow(page, totalPages);

  const linkFor = (p: number) =>
    `/cadastros/pessoas?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(status ? { status } : {}),
      page: String(p),
    })}`;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Pessoas</h1>

      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/cadastros/pessoas/novo"
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            + Inserir
          </Link>
          <ToolbarButton>Excel</ToolbarButton>
          <ToolbarButton>Selecionar colunas ▾</ToolbarButton>
        </div>
        <form action="/cadastros/pessoas" className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
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
            placeholder="Digite um nome..."
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]"
          >
            Filtrar
          </button>
          {(q || status) && (
            <Link href="/cadastros/pessoas" className="text-neutral-500 hover:underline">
              limpar
            </Link>
          )}
        </form>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Erro ao carregar pessoas: {error.message}
        </p>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="rounded border-neutral-300" />
              </th>
              <th className="w-8 px-2 py-3"></th>
              <ColHeader>Nome</ColHeader>
              <ColHeader>Equipe</ColHeader>
              <ColHeader>Empresa</ColHeader>
              <ColHeader>Cargo</ColHeader>
              <ColHeader>Projeto</ColHeader>
              <ColHeader>Operadora</ColHeader>
              <ColHeader>Regional</ColHeader>
              <ColHeader>CPF</ColHeader>
              <ColHeader>Admissão</ColHeader>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(pessoas || []).map((p: any) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-neutral-300" />
                </td>
                <td className="px-2 py-3">
                  <StatusDot status={p.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-[#a7332a]">{p.nome}</td>
                <td className="px-4 py-3 text-neutral-600">{p.equipes?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {p.empresas?.nome_fantasia || p.empresas?.razao_social || "-"}
                </td>
                <td className="px-4 py-3 text-neutral-600">{p.cargos?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.projetos?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.operadoras?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.regional || p.estado_servico || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{p.cpf || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{p.data_admissao || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Link href={`/cadastros/pessoas/${p.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deletePessoa(p.id);
                      }}
                      confirmMessage={`Excluir ${p.nome}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (pessoas || []).length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-neutral-500">
                  Nenhuma pessoa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacao numerada */}
      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
        <span>
          {count ?? 0} pessoa{count === 1 ? "" : "s"} · Página {page} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Link
            href={linkFor(Math.max(1, page - 1))}
            className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}
          >
            Ant
          </Link>
          {pages[0] > 1 && <span className="px-1">…</span>}
          {pages.map((p) => (
            <Link
              key={p}
              href={linkFor(p)}
              className={`rounded-md px-2.5 py-1 ${
                p === page ? "bg-[#a7332a] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {p}
            </Link>
          ))}
          {pages[pages.length - 1] < totalPages && <span className="px-1">…</span>}
          <Link
            href={linkFor(Math.min(totalPages, page + 1))}
            className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}
          >
            Seg
          </Link>
        </div>
      </div>
    </main>
  );
}
