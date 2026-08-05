import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { getEquipeLookups } from "../../lookups";
import { updateEquipe } from "../../actions";
import EquipeForm from "../../EquipeForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const [{ data: equipe }, lookups] = await Promise.all([
    supabase.from("equipes").select("*").eq("id", id).single(),
    getEquipeLookups(),
  ]);
  if (!equipe) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateEquipe(id, formData);
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar equipe</h1>
      <EquipeForm action={action} lookups={lookups} initial={equipe} submitLabel="Salvar alterações" />
    </main>
  );
}
