export const MODULOS_PERMISSAO = [
  {
    modulo: "Cadastros",
    funcionalidades: [
      "Pessoas",
      "Empresas",
      "Equipes",
      "Projetos",
      "Operadoras",
      "Cargos",
      "Cargo ASO",
      "Tipo de Produto",
      "Locadoras",
      "Visualizar Documentos",
      "Baixar Documentos",
    ],
  },
  {
    modulo: "Gestão de Frotas",
    funcionalidades: ["Veículos", "Despesas"],
  },
  {
    modulo: "Suprimentos",
    funcionalidades: [
      "Estoque",
      "Compras",
      "Solicitação de Material",
      "Requisição de Material",
      "Patrimônio",
    ],
  },
  {
    modulo: "Configurações",
    funcionalidades: ["Controle de Acesso"],
  },
] as const;
