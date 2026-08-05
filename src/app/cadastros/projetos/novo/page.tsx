import { createCatalogItem } from "@/lib/catalog/actions";
import CatalogForm from "@/lib/catalog/CatalogForm";

const config = { table: "projetos", basePath: "/cadastros/projetos", hasLogoUrl: true };

export default function Page() {
  const action = async (formData: FormData) => {
    "use server";
    await createCatalogItem(config, formData);
  };
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo: Projetos</h1>
      <CatalogForm action={action} basePath={config.basePath} submitLabel="Criar" hasLogoUrl={true} />
    </main>
  );
}
