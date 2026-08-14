import { createServiceClient } from "@/lib/supabase/server";

export const TREINAMENTO_TIPOS = [
  "ASO",
  "CNH",
  "CONTRATO",
  "FICHA DE EPI",
  "INTEGRAÇÃO SEGURANÇA",
  "NR-33 - SEGURANÇA E SAÚDE NO TRABALHO EM ESPAÇOS CONFINADOS",
  "NR06",
  "NR10",
  "NR18 - SOLDAGEM E CORTE A QUENTE",
  "NR18 (ANDAIME)",
  "NR18 (CADEIRINHA)",
  "NR18 (TRABALHO A QUENTE)",
  "NR20 - INFLAMÁVEIS E COMBUSTÍVEIS",
  "NR35",
  "ORDEM DE SERVIÇO",
  "PCMSO",
  "PGR",
  "PRIMEIROS SOCORROS",
  "RESGATE EM ALTURA - NR35",
  "SEGURO",
  "TERMO DE CONSCENTIMENTO",
];

export const TREINAMENTO_STATUS = ["aprovado", "nao_se_aplica", "pendente", "vencido", "renovar"];

export async function getPessoaLookups() {
  const supabase = createServiceClient();
  const [empresas, cargos, cargosAso, projetos, operadoras, equipes] = await Promise.all([
    supabase.from("empresas").select("id, razao_social, nome_fantasia").order("razao_social"),
    supabase.from("cargos").select("id, nome").order("nome"),
    supabase.from("cargos_aso").select("id, nome").order("nome"),
    supabase.from("projetos").select("id, nome").order("nome"),
    supabase.from("operadoras").select("id, nome").order("nome"),
    supabase.from("equipes").select("id, nome, team_leader_id, lider:pessoas!equipes_team_leader_id_fkey ( nome )").order("nome"),
  ]);

  const equipesComLider = (equipes.data || []).map((e: any) => ({
    id: e.id as string,
    nome: e.nome as string,
    lider_nome: (e.lider?.nome as string) || "",
  }));

  return {
    empresas: empresas.data || [],
    cargos: cargos.data || [],
    cargosAso: cargosAso.data || [],
    projetos: projetos.data || [],
    operadoras: operadoras.data || [],
    equipes: equipesComLider,
  };
}

export type PessoaLookups = Awaited<ReturnType<typeof getPessoaLookups>>;
