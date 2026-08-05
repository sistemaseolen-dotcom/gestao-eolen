import DespesaForm from "../DespesaForm";
import { createDespesa } from "../actions";

export default function NovaDespesaPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova despesa de frota</h1>
      <DespesaForm action={createDespesa} submitLabel="Criar" />
    </main>
  );
}
