"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth/actions";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const nav: NavItem[] = [
  { label: "Dashboards", href: "/" },
  {
    label: "Cadastros",
    href: "/cadastros",
    children: [
      { label: "Pessoas", href: "/cadastros/pessoas" },
      { label: "Empresas", href: "/cadastros/empresas" },
      { label: "Equipes", href: "/cadastros/equipes" },
      { label: "Projetos", href: "/cadastros/projetos" },
      { label: "Operadoras", href: "/cadastros/operadoras" },
      { label: "Cargos", href: "/cadastros/cargos" },
      { label: "Cargo ASO", href: "/cadastros/cargo-aso" },
      { label: "Tipo de Produto", href: "/cadastros/tipo-produto" },
      { label: "Locadoras", href: "/cadastros/locadoras" },
      { label: "Documentos", href: "/cadastros/documentos" },
    ],
  },
  {
    label: "Gestão de Frotas",
    href: "/gestao-frotas",
    children: [
      { label: "Veículos", href: "/gestao-frotas/veiculos" },
      { label: "Despesas", href: "/gestao-frotas/despesas" },
    ],
  },
  {
    label: "Suprimentos",
    href: "/suprimentos",
    children: [
      { label: "Estoque", href: "/suprimentos/estoque" },
      { label: "Compras", href: "/suprimentos/compras" },
      { label: "Solicitação de Material", href: "/suprimentos/solicitacao" },
      { label: "Requisição de Material", href: "/suprimentos/requisicao" },
      { label: "Patrimônio", href: "/suprimentos/patrimonio" },
    ],
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    children: [{ label: "Controle de Acesso", href: "/configuracoes/controle-acesso" }],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M7 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar({
  user,
}: {
  user?: { username: string; role: string } | null;
}) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(() => {
    const active = nav.find(
      (item) => item.children && pathname.startsWith(item.href ?? "__none__")
    );
    return active?.label ?? null;
  });

  return (
    <aside className="relative flex h-screen w-64 shrink-0 flex-col overflow-hidden text-white">
      {/* Fundo: torre + degrade laranja/vermelho da marca */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/torre.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#d94a2b]/95 via-[#c33a2f]/95 to-[#7a1f2b]/97" />
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/10 px-6 py-6">
        <Image
          src="/logo-eolen.png"
          alt="Eolen"
          width={140}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </div>

      {/* Busca */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-md bg-black/20 px-3 py-2 text-sm text-white/70 ring-1 ring-white/10">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth={1.6} />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Procurar opção do menu..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Navegação */}
      <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-6">
        <ul className="space-y-1">
          {nav.map((item) => {
            const hasChildren = !!item.children?.length;
            const isActiveRoot =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href ?? "__none__");
            const isOpen = openSection === item.label;

            return (
              <li key={item.label}>
                <div
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    isActiveRoot && !hasChildren
                      ? "bg-white text-[#a7332a] font-medium"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Link
                    href={item.href ?? "#"}
                    className="flex-1"
                    onClick={() => hasChildren && setOpenSection(isOpen ? null : item.label)}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={`Expandir ${item.label}`}
                      onClick={() => setOpenSection(isOpen ? null : item.label)}
                      className="p-1"
                    >
                      <ChevronIcon open={isOpen} />
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <ul className="ml-3 mt-1 space-y-0.5 border-l border-white/15 pl-3">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                              childActive
                                ? "bg-white text-[#a7332a] font-medium"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usuário logado / sair */}
      {user && (
        <div className="border-t border-white/10 px-4 py-3">
          <div className="mb-2 truncate text-xs text-white/70" title={user.username}>
            {user.username}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-md bg-black/20 px-3 py-1.5 text-left text-sm text-white/90 hover:bg-black/30"
            >
              Sair
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
