import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "operadoras", basePath: "/cadastros/operadoras", hasLogoUrl: false };

export default function Page() {
  return <CatalogListPage config={config} title="Operadoras" />;
}
