import VeiculoForm from "../VeiculoForm";
import { createVeiculo } from "../actions";
import { getVeiculoLookups } from "../lookups";

export default async function NovoVeiculoPage() {
  const lookups = await getVeiculoLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo veículo</h1>
      <VeiculoForm action={createVeiculo} lookups={lookups} submitLabel="Criar" />
    </main>
  );
}
