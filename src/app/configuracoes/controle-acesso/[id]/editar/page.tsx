import { notFound } from "next/navigation";
import UsuarioForm from "../../UsuarioForm";
import { updateUsuario } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  // Nunca selecionar password_hash aqui: o formulario de edicao jamais deve
  // receber ou pre-preencher a senha atual (falha de seguranca identificada no GPO antigo).
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, username, nome, email, role, status")
    .eq("id", id)
    .single();

  if (!usuario) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar usuário</h1>
      <UsuarioForm
        action={updateUsuario.bind(null, id)}
        initial={usuario}
        isEdit
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
