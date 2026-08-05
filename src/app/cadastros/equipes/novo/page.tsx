import { getEquipeLookups } from "../lookups";
import { createEquipe } from "../actions";
import EquipeForm from "../EquipeForm";

export default async function Page() {
  const lookups = await getEquipeLookups();
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova equipe</h1>
      <EquipeForm action={createEquipe} lookups={lookups} submitLabel="Criar equipe" />
    </main>
  );
}
