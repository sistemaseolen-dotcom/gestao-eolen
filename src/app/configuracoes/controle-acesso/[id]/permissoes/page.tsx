import { notFound } from "next/navigation";
import PermissoesForm from "../../PermissoesForm";
import { savePermissoes } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function PermissoesUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: usuario }, { data: permissoes }] = await Promise.all([
    supabase.from("usuarios").select("id, username, nome").eq("id", id).single(),
    supabase.from("permissoes").select("modulo, funcionalidade").eq("usuario_id", id).eq("permitido", true),
  ]);

  if (!usuario) notFound();

  const permitidos = new Set(
    (permissoes || []).map((p: any) => `${p.modulo}::${p.funcionalidade}`)
  );

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Permissões</h1>
      <PermissoesForm
        action={savePermissoes.bind(null, id)}
        usuarioNome={usuario.nome || usuario.username}
        permitidos={permitidos}
      />
    </main>
  );
}
