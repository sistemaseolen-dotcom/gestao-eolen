"use client";

import { useState } from "react";

export default function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => void;
  confirmMessage: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap text-xs">
        <span className="text-neutral-500">Excluir?</span>
        <form action={action}>
          <button type="submit" className="font-medium text-red-600 hover:underline">
            Sim
          </button>
        </form>
        <button type="button" onClick={() => setConfirming(false)} className="text-neutral-500 hover:underline">
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      title={confirmMessage}
      onClick={() => setConfirming(true)}
      className="text-neutral-400 hover:text-red-600"
    >
      ✕
    </button>
  );
}
