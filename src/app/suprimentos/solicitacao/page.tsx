import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteSolicitacao, gerarPedidoDeCompra } from "./actions";
import DeleteButton from "@/components/DeleteButton";

const PAGE_SIZE = 15;

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "aguardando").toLowerCase();
  const colors: Record<string, string> = {
    aguardando: "bg-yellow-100 text-yellow-800",
    aprovado: "bg-green-100 text-green-800",
    rejeitado: "bg-red-100 text-red-800",
    convertido: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[s] || "bg-neutral-100 text-neutral-700"}`}>
      {s}
    </span>
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

export default async function SolicitacaoPage({
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
    .from("solicitacoes_material")
    .select(`id, status, data, sigla, obra, descricao, unidade, pessoas ( nome )`, { count: "exact" })
    .order("data", { ascending: false })
    .range(from, to);

  if (q) query = query.or(`sigla.ilike.%${q}%,obra.ilike.%${q}%,descricao.ilike.%${q}%`);

  const { data: solicitacoes, count, error } = await query;
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const pages = pageWindow(page, totalPages);
  const linkFor = (p: number) => `/suprimentos/solicitacao?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Solicitação de Material</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <Link href="/suprimentos/solicitacao/novo" className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
          + Inserir
        </Link>
        <form action="/suprimentos/solicitacao" className="flex items-center gap-2 text-sm text-neutral-600">
          <span>Buscar</span>
          <input type="text" name="q" defaultValue={q} placeholder="sigla, obra ou descrição" className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <button type="submit" className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]">
            Filtrar
          </button>
          {q && <Link href="/suprimentos/solicitacao" className="text-neutral-500 hover:underline">limpar</Link>}
        </form>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Erro: {error.message}</p>}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Data</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Solicitante</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Sigla</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Obra</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Descrição</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(solicitacoes || []).map((s: any) => (
              <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{s.data || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{s.pessoas?.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{s.sigla || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{s.obra || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{s.descricao || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap text-neutral-400">
                    {s.status === "aprovado" && (
                      <form
                        action={async () => {
                          "use server";
                          await gerarPedidoDeCompra(s.id);
                        }}
                      >
                        <button type="submit" className="text-xs font-medium text-[#a7332a] hover:underline">
                          Gerar Pedido de Compra
                        </button>
                      </form>
                    )}
                    <Link href={`/suprimentos/solicitacao/${s.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteSolicitacao(s.id);
                      }}
                      confirmMessage="Excluir esta solicitação?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (solicitacoes || []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">Nenhuma solicitação encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
        <span>{count ?? 0} solicitação(ões) · Página {page} de {totalPages}</span>
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
