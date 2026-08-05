import { notFound } from "next/navigation";
import VeiculoForm from "../../VeiculoForm";
import { updateVeiculo } from "../../actions";
import { getVeiculoLookups } from "../../lookups";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarVeiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const [{ data: veiculo }, lookups] = await Promise.all([
    supabase
      .from("veiculos")
      .select(
        "id, contrato, data_contrato, locadora_id, placa, condutor_pessoa_id, status, km_retirada, km_atual, km_revisao_realizada, proxima_revisao_km, km_devolucao, observacao, projeto_id, regional, data_retirada, data_devolucao"
      )
      .eq("id", id)
      .single(),
    getVeiculoLookups(),
  ]);

  if (!veiculo) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar veículo</h1>
      <VeiculoForm
        action={updateVeiculo.bind(null, id)}
        lookups={lookups}
        initial={veiculo}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
