import EstoqueForm from "../EstoqueForm";
import { createEstoque } from "../actions";
import { getProdutoLookups } from "../lookups";

export default async function NovoEstoquePage() {
  const lookups = await getProdutoLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo item de estoque</h1>
      <EstoqueForm action={createEstoque} lookups={lookups} submitLabel="Criar" />
    </main>
  );
}
