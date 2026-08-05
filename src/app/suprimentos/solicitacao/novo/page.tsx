import SolicitacaoForm from "../SolicitacaoForm";
import { createSolicitacao } from "../actions";
import { getSolicitacaoLookups } from "../lookups";

export default async function NovaSolicitacaoPage() {
  const lookups = await getSolicitacaoLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova solicitação de material</h1>
      <SolicitacaoForm action={createSolicitacao} lookups={lookups} submitLabel="Criar" />
    </main>
  );
}
