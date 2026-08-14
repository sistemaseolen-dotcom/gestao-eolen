"use client";

import { useMemo, useState } from "react";

export type DetalheRow = {
  nome: string;
  regional?: string | null;
  projeto?: string | null;
  operadora?: string | null;
  cargo?: string | null;
  extra?: string | null;
};

function Modal({
  title,
  rows,
  onClose,
}: {
  title: string;
  rows: DetalheRow[];
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.nome, r.regional, r.projeto, r.operadora, r.cargo, r.extra]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [q, rows]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h3 className="text-sm font-semibold text-neutral-800">Detalhes — {title}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            ✕
          </button>
        </div>
        <div className="border-b border-neutral-200 p-3">
          <input
            autoFocus
            placeholder="Pesquisar por nome, regional, projeto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none"
          />
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-2 font-medium text-neutral-500">Nome</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Regional</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Projeto</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Operadora</th>
                <th className="px-4 py-2 font-medium text-neutral-500">Cargo/Função</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-2 font-medium text-neutral-700">{r.nome}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.regional || "-"}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.projeto || "-"}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.operadora || "-"}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.cargo || r.extra || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-neutral-200 p-3 text-xs text-neutral-500">
          Total de itens: {filtered.length}
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Ver detalhes"
      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
      </svg>
    </button>
  );
}

export function Card({
  title,
  detailRows,
  children,
}: {
  title: string;
  detailRows?: DetalheRow[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700">{title}</h2>
        {detailRows && <MenuIcon onClick={() => setOpen(true)} />}
      </div>
      {children}
      {open && detailRows && <Modal title={title} rows={detailRows} onClose={() => setOpen(false)} />}
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  color,
  onClick,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  onClick?: () => void;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={`flex items-center gap-3 text-xs ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <span className="w-32 shrink-0 truncate text-neutral-600" title={label}>
        {label}
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-neutral-100">
        <div className="h-4 rounded" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 shrink-0 text-right font-medium text-neutral-700">{value}</span>
    </div>
  );
}

export function BarGroupWithModal({
  title,
  data,
  color,
  rowsByLabel,
}: {
  title: string;
  data: { label: string; value: number }[];
  color: string;
  rowsByLabel: Record<string, DetalheRow[]>;
}) {
  const [modalLabel, setModalLabel] = useState<string | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const allRows = Object.values(rowsByLabel).flat();

  return (
    <Card title={`${title} (${allRows.length})`} detailRows={allRows}>
      <div className="space-y-2">
        {data.map((d) => (
          <BarRow
            key={d.label}
            label={d.label}
            value={d.value}
            max={max}
            color={color}
            onClick={() => setModalLabel(d.label)}
          />
        ))}
        {data.length === 0 && <p className="text-sm text-neutral-500">Sem dados.</p>}
      </div>
      {modalLabel && (
        <Modal
          title={`${title} — ${modalLabel}`}
          rows={rowsByLabel[modalLabel] || []}
          onClose={() => setModalLabel(null)}
        />
      )}
    </Card>
  );
}
