import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { updateCatalogItem } from "@/lib/catalog/actions";
import CatalogForm from "@/lib/catalog/CatalogForm";

const config = { table: "tipos_produto", basePath: "/cadastros/tipo-produto", hasLogoUrl: false };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: item } = await supabase.from(config.table).select("*").eq("id", id).single();
  if (!item) notFound();

  const action = async (formData: FormData) => {
    "use server";
    await updateCatalogItem(config, id, formData);
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar: Tipo de Produto</h1>
      <CatalogForm action={action} basePath={config.basePath} submitLabel="Salvar" initial={item as any} hasLogoUrl={false} />
    </main>
  );
}
