import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteEmpresa } from "./actions";
import DeleteButton from "@/components/DeleteButton";

const PAGE_SIZE = 10;

function StatusDot({ status }: { status: boolean | null }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}
      title={status ? "Ativo" : "Inativo"}
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

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  let query = supabase
    .from("empresas")
    .select("id, cnpj, razao_social, nome_fantasia, porte, status, cidade, uf, telefone", { count: "exact" })
    .order("razao_social", { ascending: true })
    .range(from, to);

  if (q) {
    query = query.or(`razao_social.ilike.%${q}%,nome_fantasia.ilike.%${q}%,cnpj.ilike.%${q}%`);
  }

  const { data: empresas, count, error } = await query;
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const pages = pageWindow(page, totalPages);

  const linkFor = (p: number) =>
    `/cadastros/empresas?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Empresas</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/cadastros/empresas/novo"
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            + Inserir
          </Link>
          <ToolbarButton>Excel</ToolbarButton>
        </div>
        <form action="/cadastros/empresas" className="flex items-center gap-2 text-sm text-neutral-600">
          <span>Buscar por nome ou CNPJ</span>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Digite..."
            className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]"
          >
            Filtrar
          </button>
          {q && (
            <Link href="/cadastros/empresas" className="text-neutral-500 hover:underline">
              limpar
            </Link>
          )}
        </form>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Erro ao carregar empresas: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="rounded border-neutral-300" />
              </th>
              <th className="w-8 px-2 py-3"></th>
              <ColHeader>Razão social</ColHeader>
              <ColHeader>Nome fantasia</ColHeader>
              <ColHeader>CNPJ</ColHeader>
              <ColHeader>Porte</ColHeader>
              <ColHeader>Cidade/UF</ColHeader>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(empresas || []).map((e: any) => (
              <tr key={e.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-neutral-300" />
                </td>
                <td className="px-2 py-3">
                  <StatusDot status={e.status} />
                </td>
                <td className="max-w-xs truncate px-4 py-3 font-medium text-[#a7332a]" title={e.razao_social}>
                  {e.razao_social}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-neutral-600">{e.nome_fantasia || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{e.cnpj || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{e.porte || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                  {e.cidade ? `${e.cidade}${e.uf ? "/" + e.uf : ""}` : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Link href={`/cadastros/empresas/${e.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteEmpresa(e.id);
                      }}
                      confirmMessage={`Excluir ${e.razao_social}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (empresas || []).length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-neutral-500">
                  Nenhuma empresa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
        <span>
          {count ?? 0} empresa{count === 1 ? "" : "s"} · Página {page} de {totalPages}
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
