import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { getPessoaLookups } from "../../lookups";
import { updatePessoa } from "../../actions";
import PessoaForm from "../../PessoaForm";

export default async function EditarPessoaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: pessoa }, lookups] = await Promise.all([
    supabase.from("pessoas").select("*").eq("id", id).single(),
    getPessoaLookups(),
  ]);

  if (!pessoa) notFound();

  const boundAction = async (formData: FormData) => {
    "use server";
    await updatePessoa(id, formData);
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar pessoa</h1>
      <PessoaForm action={boundAction} lookups={lookups} initial={pessoa} submitLabel="Salvar alterações" />
    </main>
  );
}
