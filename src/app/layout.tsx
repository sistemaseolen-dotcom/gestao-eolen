import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Gestão Eolen",
  description: "Sistema próprio de gestão - Cadastros, Frotas, Suprimentos",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getCurrentUser();
  const user = session ? { username: session.username, role: session.role } : null;

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
