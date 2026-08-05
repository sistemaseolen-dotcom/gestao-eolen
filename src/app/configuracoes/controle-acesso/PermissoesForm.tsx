"use client";

import { useState } from "react";
import Link from "next/link";
import { MODULOS_PERMISSAO } from "./modulos";

export default function PermissoesForm({
  action,
  usuarioNome,
  permitidos,
}: {
  action: (formData: FormData) => void;
  usuarioNome: string;
  permitidos: Set<string>; // valores "modulo::funcionalidade"
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set(permitidos));
  const [pending, setPending] = useState(false);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAllInModulo(modulo: string, funcionalidades: readonly string[], marcarTudo: boolean) {
    setChecked((prev) => {
      const next = new Set(prev);
      for (const f of funcionalidades) {
        const key = `${modulo}::${f}`;
        if (marcarTudo) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  }

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="max-w-3xl rounded-lg border border-neutral-200 bg-white p-6"
    >
      <p className="mb-4 text-sm text-neutral-600">
        Permissões de <span className="font-medium text-neutral-800">{usuarioNome}</span>
      </p>

      <div className="space-y-6">
        {MODULOS_PERMISSAO.map(({ modulo, funcionalidades }) => {
          const todasMarcadas = funcionalidades.every((f) => checked.has(`${modulo}::${f}`));
          return (
            <div key={modulo} className="rounded-md border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-2">
                <span className="text-sm font-medium text-neutral-800">{modulo}</span>
                <label className="flex items-center gap-2 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={todasMarcadas}
                    onChange={(e) => toggleAllInModulo(modulo, funcionalidades, e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  Selecionar todos
                </label>
              </div>
              <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                {funcionalidades.map((f) => {
                  const key = `${modulo}::${f}`;
                  return (
                    <label key={key} className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        name="permissao"
                        value={key}
                        checked={checked.has(key)}
                        onChange={() => toggle(key)}
                        className="rounded border-neutral-300"
                      />
                      {f}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar permissões"}
        </button>
        <Link href="/configuracoes/controle-acesso" className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
