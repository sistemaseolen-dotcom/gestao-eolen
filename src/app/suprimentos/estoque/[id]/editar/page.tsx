import { notFound } from "next/navigation";
import EstoqueForm from "../../EstoqueForm";
import { updateEstoque } from "../../actions";
import { getProdutoLookups } from "../../lookups";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarEstoquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const [{ data: item }, lookups] = await Promise.all([
    supabase
      .from("estoque")
      .select("id, produto_id, codigo, sku, estoque_fisico, unidade, localizacao")
      .eq("id", id)
      .single(),
    getProdutoLookups(),
  ]);

  if (!item) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar item de estoque</h1>
      <EstoqueForm
        action={updateEstoque.bind(null, id)}
        lookups={lookups}
        initial={item}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
