import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "cargos", basePath: "/cadastros/cargos", hasLogoUrl: false };

export default function Page() {
  return <CatalogListPage config={config} title="Cargos" />;
}
