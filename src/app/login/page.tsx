"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[#a7332a] px-4 py-2 text-sm font-medium text-white hover:bg-[#8c2a23] disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0 -z-10">
        <Image src="/torre.png" alt="" fill priority className="object-cover object-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#d94a2b]/95 via-[#c33a2f]/95 to-[#7a1f2b]/97" />
      </div>

      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image src="/logo-eolen.png" alt="Eolen" width={160} height={40} className="h-10 w-auto" priority />
        </div>
        <h1 className="mb-6 text-center text-base font-semibold text-neutral-700">
          Acesso ao Gestão Eolen
        </h1>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Usuário</span>
            <input
              name="username"
              required
              autoFocus
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Senha</span>
            <input
              type="password"
              name="senha"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[#a7332a] focus:outline-none"
            />
          </label>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
