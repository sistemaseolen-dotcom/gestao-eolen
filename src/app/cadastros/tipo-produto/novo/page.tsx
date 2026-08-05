import { createCatalogItem } from "@/lib/catalog/actions";
import CatalogForm from "@/lib/catalog/CatalogForm";

const config = { table: "tipos_produto", basePath: "/cadastros/tipo-produto", hasLogoUrl: false };

export default function Page() {
  const action = async (formData: FormData) => {
    "use server";
    await createCatalogItem(config, formData);
  };
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo: Tipo de Produto</h1>
      <CatalogForm action={action} basePath={config.basePath} submitLabel="Criar" hasLogoUrl={false} />
    </main>
  );
}
