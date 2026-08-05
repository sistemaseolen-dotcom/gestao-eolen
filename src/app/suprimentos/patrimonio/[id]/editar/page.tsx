import { notFound } from "next/navigation";
import PatrimonioForm from "../../PatrimonioForm";
import { updatePatrimonio } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarPatrimonioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: item } = await supabase
    .from("patrimonio")
    .select("id, tipo, modelo, numero_serie, codigo_patrimonio, valor, status, responsavel_nome")
    .eq("id", id)
    .single();

  if (!item) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar item de patrimônio</h1>
      <PatrimonioForm
        action={updatePatrimonio.bind(null, id)}
        initial={item}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
