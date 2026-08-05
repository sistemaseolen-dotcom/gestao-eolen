import { notFound } from "next/navigation";
import PatrimonioForm from "../../PatrimonioForm";
import { updatePatrimonio } from "../../actions";
import { getPatrimonioLookups } from "../../lookups";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarPatrimonioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const [{ data: item }, lookups] = await Promise.all([
    supabase
      .from("patrimonio")
      .select("id, tipo, modelo, numero_serie, codigo_patrimonio, valor, status, pessoa_id")
      .eq("id", id)
      .single(),
    getPatrimonioLookups(),
  ]);

  if (!item) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar item de patrimônio</h1>
      <PatrimonioForm
        action={updatePatrimonio.bind(null, id)}
        lookups={lookups}
        initial={item}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
