import DocumentoForm from "../DocumentoForm";
import { createDocumento } from "../actions";

export default function NovoDocumentoPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo documento</h1>
      <DocumentoForm action={createDocumento} submitLabel="Criar" />
    </main>
  );
}
