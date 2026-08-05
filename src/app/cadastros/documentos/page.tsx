import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteDocumento } from "./actions";
import DeleteButton from "@/components/DeleteButton";

const PAGE_SIZE = 15;

function pageWindow(current: number, total: number) {
  const span = 3;
  let start = Math.max(1, current - 1);
  let end = Math.min(total, start + span);
  start = Math.max(1, end - span);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ modulo?: string; nome?: string; de?: string; ate?: string; page?: string }>;
}) {
  const params = await searchParams;
  const modulo = (params.modulo || "").trim();
  const nome = (params.nome || "").trim();
  const de = (params.de || "").trim();
  const ate = (params.ate || "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  let query = supabase
    .from("documentos")
    .select("id, modulo, nome_arquivo, storage_path, data_upload", { count: "exact" })
    .order("data_upload", { ascending: false })
    .range(from, to);

  if (modulo) query = query.eq("modulo", modulo);
  if (nome) query = query.ilike("nome_arquivo", `%${nome}%`);
  if (de) query = query.gte("data_upload", de);
  if (ate) query = query.lte("data_upload", ate);

  const { data: documentos, count, error } = await query;
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const pages = pageWindow(page, totalPages);

  const qs = (p: number) =>
    `/cadastros/documentos?${new URLSearchParams({
      ...(modulo ? { modulo } : {}),
      ...(nome ? { nome } : {}),
      ...(de ? { de } : {}),
      ...(ate ? { ate } : {}),
      page: String(p),
    })}`;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Documentos</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <Link href="/cadastros/documentos/novo" className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
          + Inserir
        </Link>
        <form action="/cadastros/documentos" className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <input type="text" name="modulo" defaultValue={modulo} placeholder="Módulo" className="w-32 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <input type="text" name="nome" defaultValue={nome} placeholder="Nome do arquivo" className="w-40 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <span>de</span>
          <input type="date" name="de" defaultValue={de} className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <span>até</span>
          <input type="date" name="ate" defaultValue={ate} className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <button type="submit" className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]">
            Filtrar
          </button>
          {(modulo || nome || de || ate) && (
            <Link href="/cadastros/documentos" className="text-neutral-500 hover:underline">
              limpar
            </Link>
          )}
        </form>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Erro: {error.message}</p>}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 font-medium text-neutral-500">Módulo</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Nome do arquivo</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Link</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Data</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(documentos || []).map((d: any) => (
              <tr key={d.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-[#a7332a]">{d.modulo}</td>
                <td className="px-4 py-3 text-neutral-600">{d.nome_arquivo}</td>
                <td className="max-w-xs truncate px-4 py-3 text-neutral-600">
                  <a href={d.storage_path} target="_blank" rel="noreferrer" className="hover:underline">
                    {d.storage_path}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">{d.data_upload || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Link href={`/cadastros/documentos/${d.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteDocumento(d.id);
                      }}
                      confirmMessage={`Excluir ${d.nome_arquivo}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (documentos || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">Nenhum documento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-neutral-600">
        <span>{count ?? 0} documento(s) · Página {page} de {totalPages}</span>
        <div className="flex items-center gap-1">
          <Link href={qs(Math.max(1, page - 1))} className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}>Ant</Link>
          {pages[0] > 1 && <span className="px-1">…</span>}
          {pages.map((p) => (
            <Link key={p} href={qs(p)} className={`rounded-md px-2.5 py-1 ${p === page ? "bg-[#a7332a] text-white" : "border border-neutral-300 hover:bg-neutral-50"}`}>{p}</Link>
          ))}
          {pages[pages.length - 1] < totalPages && <span className="px-1">…</span>}
          <Link href={qs(Math.min(totalPages, page + 1))} className={`rounded-md border border-neutral-300 px-2.5 py-1 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"}`}>Seg</Link>
        </div>
      </div>
    </main>
  );
}
