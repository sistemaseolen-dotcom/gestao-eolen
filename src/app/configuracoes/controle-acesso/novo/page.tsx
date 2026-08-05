import UsuarioForm from "../UsuarioForm";
import { createUsuario } from "../actions";

export default function NovoUsuarioPage() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Novo usuário</h1>
      <UsuarioForm action={createUsuario} submitLabel="Criar" />
    </main>
  );
}
