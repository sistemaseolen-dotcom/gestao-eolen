import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para uso em componentes client-side, com a chave publica (anon).
 * O schema `gestao_eolen` tem RLS habilitado sem policies para anon/authenticated,
 * entao este cliente na pratica so consegue ler dados que o backend expuser via
 * API routes proprias (que usam createServiceClient). Nao usar para acessar
 * `gestao_eolen.*` diretamente.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey);
}
