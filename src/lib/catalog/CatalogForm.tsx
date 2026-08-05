"use client";

import { useState } from "react";
import Link from "next/link";

const inputCls =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none";

export default function CatalogForm({
  action,
  basePath,
  initial,
  submitLabel,
  hasLogoUrl,
}: {
  action: (formData: FormData) => void;
  basePath: string;
  initial?: { nome?: string | null; status?: boolean | null; logo_url?: string | null };
  submitLabel: string;
  hasLogoUrl?: boolean;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={action}
      onSubmit={() => setPending(true)}
      className="grid max-w-lg grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Nome *</span>
        <input name="nome" required defaultValue={initial?.nome || ""} className={inputCls} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Status</span>
        <select name="status" defaultValue={String(initial?.status ?? true)} className={inputCls}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </label>

      {hasLogoUrl && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">URL do logo</span>
          <input name="logo_url" defaultValue={initial?.logo_url || ""} className={inputCls} />
        </label>
      )}

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[#a7332a] px-5 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link href={basePath} className="rounded-md border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
