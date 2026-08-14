import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { getPessoaLookups } from "../../lookups";
import { updatePessoa, addTreinamento, deleteTreinamento } from "../../actions";
import PessoaForm from "../../PessoaForm";

export default async function EditarPessoaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: pessoa }, lookups, { data: treinamentos }] = await Promise.all([
    supabase.from("pessoas").select("*").eq("id", id).single(),
    getPessoaLookups(),
    supabase
      .from("pessoas_treinamentos")
      .select("id, tipo, status, data_emissao, data_vencimento")
      .eq("pessoa_id", id)
      .order("data_vencimento", { ascending: true }),
  ]);

  if (!pessoa) notFound();

  const boundAction = async (formData: FormData) => {
    "use server";
    await updatePessoa(id, formData);
  };

  const boundAddTreinamento = async (formData: FormData) => {
    "use server";
    await addTreinamento(formData);
  };

  const boundDeleteTreinamento = async (formData: FormData) => {
    "use server";
    await deleteTreinamento(id, formData);
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar pessoa</h1>
      <PessoaForm
        action={boundAction}
        lookups={lookups}
        initial={pessoa}
        submitLabel="Salvar alterações"
        pessoaId={id}
        treinamentos={treinamentos || []}
        addTreinamentoAction={boundAddTreinamento}
        deleteTreinamentoAction={boundDeleteTreinamento}
      />
    </main>
  );
}
