import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "locadoras", basePath: "/cadastros/locadoras", hasLogoUrl: false };

export default function Page() {
  return <CatalogListPage config={config} title="Locadoras" />;
}
