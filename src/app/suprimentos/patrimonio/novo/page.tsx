import PatrimonioForm from "../PatrimonioForm";
import { createPatrimonio } from "../actions";

export default async function NovoPatrimonioPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo item de patrimônio</h1>
      <PatrimonioForm action={createPatrimonio} submitLabel="Criar" />
    </main>
  );
}
