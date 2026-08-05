import { createServiceClient } from "@/lib/supabase/server";

export async function getPessoaLookups() {
  const supabase = createServiceClient();
  const [empresas, cargos, cargosAso, projetos, operadoras, equipes] = await Promise.all([
    supabase.from("empresas").select("id, razao_social, nome_fantasia").order("razao_social"),
    supabase.from("cargos").select("id, nome").order("nome"),
    supabase.from("cargos_aso").select("id, nome").order("nome"),
    supabase.from("projetos").select("id, nome").order("nome"),
    supabase.from("operadoras").select("id, nome").order("nome"),
    supabase.from("equipes").select("id, nome").order("nome"),
  ]);

  return {
    empresas: empresas.data || [],
    cargos: cargos.data || [],
    cargosAso: cargosAso.data || [],
    projetos: projetos.data || [],
    operadoras: operadoras.data || [],
    equipes: equipes.data || [],
  };
}

export type PessoaLookups = Awaited<ReturnType<typeof getPessoaLookups>>;
