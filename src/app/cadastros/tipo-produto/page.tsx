import CatalogListPage from "@/lib/catalog/CatalogListPage";

const config = { table: "tipos_produto", basePath: "/cadastros/tipo-produto", hasLogoUrl: false };

export default function Page() {
  return <CatalogListPage config={config} title="Tipo de Produto" />;
}
