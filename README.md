# Gestão Eolen

Sistema próprio de gestão (Cadastros, Gestão de Frotas, Suprimentos, Configurações),
substituindo o GPO de terceiros. Fundação criada: banco de dados (Supabase, schema
`gestao_eolen`) e estrutura de rotas do Next.js.

## Banco de dados

Projeto Supabase: `ebgdhcovtgrwjcglcpip` (mesmo projeto do sistema de despesas,
mas em schema isolado `gestao_eolen` — nenhuma tabela de outros sistemas foi tocada).

Tabelas já criadas: projetos, operadoras, cargos, cargos_aso, locadoras,
tipos_produto, empresas, equipes, pessoas, pessoas_treinamentos,
pessoas_credenciais_acesso, pessoas_info_adicional, documentos, usuarios, permissoes.
Todas com RLS habilitado (acesso via service role key no backend).

## Rodando localmente

1. `npm install`
2. Copie `.env.local.example` para `.env.local` e preencha `SUPABASE_SERVICE_ROLE_KEY`
   (pegue em Supabase Dashboard > Project Settings > API > service_role secret — nunca
   commitar essa chave).
3. `npm run dev`

## Estrutura

- `src/app/` — rotas (uma pasta por módulo: cadastros, gestao-frotas, suprimentos,
  configuracoes). Cada módulo hoje é só uma página placeholder.
- `src/lib/supabase/server.ts` — cliente com service role, uso exclusivo em backend.
- `src/lib/supabase/client.ts` — cliente com chave anon, para uso client-side.

## Próximos passos

Construir os módulos um a um, começando por Cadastros (Pessoas/Empresas +
Treinamentos/Exames).
