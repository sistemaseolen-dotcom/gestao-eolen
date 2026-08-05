import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteUsuario } from "./actions";
import DeleteButton from "@/components/DeleteButton";

function StatusDot({ status }: { status: boolean | null }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}
      title={status ? "Ativo" : "Inativo"}
    />
  );
}

export default async function ControleAcessoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();

  const supabase = createServiceClient();

  let query = supabase
    .from("usuarios")
    .select("id, username, nome, email, role, status")
    .order("username");

  if (q) query = query.ilike("username", `%${q}%`);

  const { data: usuarios, error } = await query;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Controle de Acesso</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-lg border border-neutral-200 bg-white px-3 py-2">
        <Link href="/configuracoes/controle-acesso/novo" className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
          + Inserir
        </Link>
        <form action="/configuracoes/controle-acesso" className="flex items-center gap-2 text-sm text-neutral-600">
          <span>Buscar por usuário</span>
          <input type="text" name="q" defaultValue={q} className="rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#a7332a] focus:outline-none" />
          <button type="submit" className="rounded-md bg-[#a7332a] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8c2a23]">
            Filtrar
          </button>
          {q && <Link href="/configuracoes/controle-acesso" className="text-neutral-500 hover:underline">limpar</Link>}
        </form>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Erro: {error.message}</p>}

      <div className="overflow-x-auto rounded-b-lg border border-t-0 border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 font-medium text-neutral-500">Usuário</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Nome</th>
              <th className="px-4 py-3 font-medium text-neutral-500">E-mail</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Perfil</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(usuarios || []).map((u: any) => (
              <tr key={u.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <StatusDot status={u.status} />
                </td>
                <td className="px-4 py-3 font-medium text-[#a7332a]">{u.username}</td>
                <td className="px-4 py-3 text-neutral-600">{u.nome || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{u.email || "-"}</td>
                <td className="px-4 py-3 text-neutral-600">{u.role === "admin" ? "Administrador" : "Usuário"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap text-neutral-400">
                    <Link href={`/configuracoes/controle-acesso/${u.id}/permissoes`} className="text-xs font-medium text-[#a7332a] hover:underline">
                      Permissões
                    </Link>
                    <Link href={`/configuracoes/controle-acesso/${u.id}/editar`} title="Editar" className="hover:text-[#a7332a]">
                      ✏️
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        await deleteUsuario(u.id);
                      }}
                      confirmMessage={`Excluir usuário ${u.username}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!error && (usuarios || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
