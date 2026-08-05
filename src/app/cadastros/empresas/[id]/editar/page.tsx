import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { updateEmpresa } from "../../actions";
import EmpresaForm from "../../EmpresaForm";

export default async function EditarEmpresaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: empresa } = await supabase.from("empresas").select("*").eq("id", id).single();

  if (!empresa) notFound();

  const boundAction = async (formData: FormData) => {
    "use server";
    await updateEmpresa(id, formData);
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar empresa</h1>
      <EmpresaForm action={boundAction} initial={empresa} submitLabel="Salvar alterações" />
    </main>
  );
}
