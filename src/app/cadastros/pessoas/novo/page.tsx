import { getPessoaLookups } from "../lookups";
import { createPessoa } from "../actions";
import PessoaForm from "../PessoaForm";

export default async function NovaPessoaPage() {
  const lookups = await getPessoaLookups();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova pessoa</h1>
      <PessoaForm action={createPessoa} lookups={lookups} submitLabel="Criar pessoa" />
    </main>
  );
}
