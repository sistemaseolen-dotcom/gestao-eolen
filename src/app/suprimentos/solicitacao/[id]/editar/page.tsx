import { notFound } from "next/navigation";
import SolicitacaoForm from "../../SolicitacaoForm";
import { updateSolicitacao } from "../../actions";
import { getSolicitacaoLookups } from "../../lookups";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarSolicitacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const [{ data: solicitacao }, lookups] = await Promise.all([
    supabase
      .from("solicitacoes_material")
      .select("id, status, data, solicitante_pessoa_id, sigla, obra, descricao, unidade")
      .eq("id", id)
      .single(),
    getSolicitacaoLookups(),
  ]);

  if (!solicitacao) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar solicitação</h1>
      <SolicitacaoForm
        action={updateSolicitacao.bind(null, id)}
        lookups={lookups}
        initial={solicitacao}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
