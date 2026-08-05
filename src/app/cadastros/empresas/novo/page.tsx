import { createEmpresa } from "../actions";
import EmpresaForm from "../EmpresaForm";

export default function NovaEmpresaPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Nova empresa</h1>
      <EmpresaForm action={createEmpresa} submitLabel="Criar empresa" />
    </main>
  );
}
