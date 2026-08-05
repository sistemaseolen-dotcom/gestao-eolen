import { notFound } from "next/navigation";
import DespesaForm from "../../DespesaForm";
import { updateDespesa } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarDespesaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: despesa } = await supabase
    .from("despesas_frota")
    .select("id, placa, veiculo_descricao, empresa_descricao, data_lancamento, valor_total, descricao, observacao")
    .eq("id", id)
    .single();

  if (!despesa) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar despesa</h1>
      <DespesaForm
        action={updateDespesa.bind(null, id)}
        initial={despesa}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
