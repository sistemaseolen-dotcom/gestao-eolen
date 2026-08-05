import RequisicaoForm from "../RequisicaoForm";
import { createRequisicao } from "../actions";
import { getProdutoLookups } from "../lookups";

export default async function NovaRequisicaoPage() {
  const lookups = await getProdutoLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova requisição de material</h1>
      <RequisicaoForm action={createRequisicao} lookups={lookups} submitLabel="Criar" />
    </main>
  );
}
