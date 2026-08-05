import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import { deleteCatalogItem, type CatalogConfig } from "./actions";

function StatusDot({ status }: { status: boolean | null }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}
      title={status ? "Ativo" : "Inativo"}
    />
  );
}

export default async function CatalogListPage({
  config,
  title,
}: {
  config: CatalogConfig;
  title: string;
}) {
  const supabase = createServiceClient();
  const cols = config.hasLogoUrl ? "id, nome, status, logo_url" : "id, nome, status";
  const { data: items, error } = await supabase.from(config.table).select(cols).order("nome");

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">{title}</h1>

      <div className="flex items-center justify-between rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <Link
          href={`${config.basePath}/novo`}
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          + Inserir
        </Link>
        <span className="text-sm text-neutral-500">{items?.length ?? 0} registro(s)</span>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Erro ao carregar: {error.message}</p>
      )}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium text-neutral-500">Nome</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {((items as any[]) || []).map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <StatusDot status={item.status} />
                </td>
                <td className="px-4 py-3 font-medium text-[#a7332a]">{item.nome}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Link href={`${config.basePath}/${item.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteCatalogItem(config, item.id);
                      }}
                      confirmMessage={`Excluir ${item.nome}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (!items || items.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-neutral-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
