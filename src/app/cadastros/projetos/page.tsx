import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "projetos", basePath: "/cadastros/projetos", hasLogoUrl: true };

export default function Page() {
  return <CatalogListPage config={config} title="Projetos" />;
}
