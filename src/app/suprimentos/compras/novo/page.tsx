import CompraForm from "../CompraForm";
import { createCompra } from "../actions";

export default function NovaCompraPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova ordem de compra</h1>
      <CompraForm action={createCompra} submitLabel="Criar" />
    </main>
  );
}
