import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para uso EXCLUSIVO em server (API routes / server actions),
 * usando a service role key. Nunca importar este arquivo em componentes client.
 * O acesso ao banco (schema `gestao_eolen`) e feito so por aqui, apos checar
 * autenticacao e permissoes do usuario (tabelas gestao_eolen.usuarios / .permissoes).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltam variaveis de ambiente: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    db: { schema: "gestao_eolen" },
    auth: { persistSession: false },
  });
}
