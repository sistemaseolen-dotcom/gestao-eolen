"use client";

import { useState } from "react";
import Link from "next/link";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export default function UsuarioForm({
  action,
  initial,
  isEdit,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: {
    username?: string | null;
    nome?: string | null;
    email?: string | null;
    role?: string | null;
    status?: boolean | null;
  };
  isEdit?: boolean;
  submitLabel: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-2xl grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6 sm:grid-cols-2"
    >
      <Field label="Nome de usuário *">
        <input name="username" required defaultValue={initial?.username || ""} className={inputCls} />
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={String(initial?.status ?? true)} className={inputCls}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </Field>

      <Field label="Nome completo">
        <input name="nome" defaultValue={initial?.nome || ""} className={inputCls} />
      </Field>

      <Field label="E-mail">
        <input type="email" name="email" defaultValue={initial?.email || ""} className={inputCls} />
      </Field>

      <Field label="Perfil">
        <select name="role" defaultValue={initial?.role || "user"} className={inputCls}>
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </Field>

      <Field label={isEdit ? "Nova senha (deixe em branco para manter)" : "Senha *"}>
        <input
          type="password"
          name="senha"
          required={!isEdit}
          minLength={6}
          autoComplete="new-password"
          placeholder={isEdit ? "••••••" : ""}
          className={inputCls}
        />
      </Field>

      <div className="col-span-full mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link href="/configuracoes/controle-acesso" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
