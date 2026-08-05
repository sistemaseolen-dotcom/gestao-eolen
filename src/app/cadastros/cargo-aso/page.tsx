import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "cargos_aso", basePath: "/cadastros/cargo-aso", hasLogoUrl: false };

export default function Page() {
  return <CatalogListPage config={config} title="Cargo ASO" />;
}
