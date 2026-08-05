import PatrimonioForm from "../PatrimonioForm";
import { createPatrimonio } from "../actions";
import { getPatrimonioLookups } from "../lookups";

export default async function NovoPatrimonioPage() {
  const lookups = await getPatrimonioLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo item de patrimônio</h1>
      <PatrimonioForm action={createPatrimonio} lookups={lookups} submitLabel="Criar" />
    </main>
  );
}
