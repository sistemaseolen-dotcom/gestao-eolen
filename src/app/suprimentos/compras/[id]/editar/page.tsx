import { notFound } from "next/navigation";
import CompraForm from "../../CompraForm";
import { updateCompra } from "../../actions";
import { createServiceClient } from "@/lib/supabase/server";

export default async function EditarCompraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: compra } = await supabase
    .from("compras")
    .select("id, numero_pedido, situacao, data, previsao_entrega, fornecedor, valor_total, marcadores")
    .eq("id", id)
    .single();

  if (!compra) notFound();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Editar ordem de compra</h1>
      <CompraForm
        action={updateCompra.bind(null, id)}
        initial={compra}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}
