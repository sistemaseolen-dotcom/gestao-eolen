import { notFound } from "next/navigation";
import DocumentoForm from "../../DocumentoForm";
import { updateDocumento } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarDocumentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: documento } = await supabase
    .from("documentos")
    .select("id, modulo, registro_id, nome_arquivo, storage_path, data_upload")
    .eq("id", id)
    .single();

  if (!documento) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar documento</h1>
      <DocumentoForm
        action={updateDocumento.bind(null, id)}
        initial={documento}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
