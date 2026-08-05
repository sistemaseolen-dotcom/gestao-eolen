# Mapeamento Funcional do Sistema GPO (gpoeolen.vercel.app)

Levantamento feito navegando o sistema como usuário autorizado (Diego Nunes), catalogando módulos, campos e integrações entre eles. Objetivo: servir de base para planejar um sistema próprio com as mesmas funcionalidades — nenhum código, layout ou dado do fornecedor (SITI) foi copiado ou extraído.

## Visão geral

O GPO é um sistema de gestão para empresa prestadora de serviços terceirizados no setor de telecom — atende projetos de fabricantes de equipamento (Ericsson, Huawei, ZTE, Nokia, NG) para operadoras móveis (Claro, Tim, Vivo). Cobre: cadastro de pessoas/empresas terceirizadas, controle de treinamentos e exames obrigatórios (NRs, ASO, PCMSO), frota de veículos, estoque/compras/patrimônio, e controle de acesso de usuários.

Menu principal: **Dashboards · Cadastros · Gestão de Frotas · Suprimentos · Configurações**

## 1. Dashboards

Tela inicial com indicadores de **Treinamentos/Exames** por tipo (ASO, NR10, NR35, NR06, PGR, PCMSO, Primeiros Socorros, NR18 em várias modalidades — cadeirinha, andaime, trabalho a quente, soldagem —, NR20, NR33, Resgate em Altura, Seguro, Ordem de Serviço, Contrato, Ficha de EPI, Integração Segurança, Termo de Conscientização, CNH), com status: Aprovado, Não se aplica, Pendente, Vencido, Renovar. Inclui gráfico de rosca (% aprovado) e mapa/lista por estado (UF) mostrando pessoas por região.

## 2. Cadastros

### 2.1 Empresas
Empresas terceirizadas (PJ) prestadoras de serviço. Cadastro busca dados automaticamente pelo CNPJ (nome empresarial, nome fantasia, porte, CNAE principal/secundário, natureza jurídica). Abas do formulário: **Dados Cadastrais (PJ) · Veículos · Colaboradores** — ou seja, cada empresa pode ter veículos e colaboradores vinculados diretamente.

### 2.2 Pessoas
Cadastro de colaboradores/técnicos. Abas:
- **Dados Gerais**: nome, tipo de contratação, estado de serviço, regional, projeto, operadora, equipe, líder, nº registro, data admissão/demissão, status, matrícula e-social, coordenador, cargo ASO, cargo, empresa (PJ) vinculada, CNPJ, e-mail/telefone particular e corporativo.
- **Treinamentos e Exames**: IDs de acesso a sistemas dos fabricantes (Ericsson, Huawei, ZTE, Isignum) e credenciais associadas; data de cadastro/reativação; lançamento de treinamento/exame individual com status (controle por vencimento) e data de emissão — alimenta os gráficos do dashboard.
- **Informação Adicional**: dados de linha/aparelho corporativo (telefone Vivo, IMEI, matrícula Vivo, permissão de acesso Tim), número e validade de contrato, e-mail de acesso a portal de operadora, observações.

Listagem principal permite filtrar por tipo de contratação e status, e tem atalho direto para a tela de Treinamentos.

### 2.3 Produtos
Catálogo de itens (equipamentos, materiais) com código, unidade, categoria, estoque e marcadores — base para os módulos de Suprimentos.

### 2.4 Equipe
Grupos de trabalho: nome da equipe, team líder, status, regional, operadora, projeto, membros.

### 2.5 Tipo de Produto
Lista simples de categorias de produto (câmera de segurança, celular, GPS, monitor, notebook etc.), usada em Produtos/Patrimônio.

### 2.6 Projeto
Fabricantes/parceiros atendidos (Ericsson, Huawei, NG, Nokia, Telefônica), cada um com logo (URL) e status ativo/inativo.

### 2.7 Operadora
Operadoras móveis atendidas (Claro, Tim, Vivo) — lista simples.

### 2.8 Cargo / Cargo Aso
Cargos/funções da empresa (assistente, auditor de qualidade, clean up, coordenador, gerente, membro, supervisor, team líder, entre outros — 13 no total) e uma lista separada de cargos usada especificamente no contexto de exames ASO.

### 2.9 Locadora
Cadastro das locadoras de veículos usadas nos contratos de frota.

### 2.10 Documentos
Repositório central de arquivos, filtrável por módulo, nome do arquivo e intervalo de datas — documentos ficam anexados aos registros de origem (pessoa, empresa, veículo etc.) mas também são consultáveis num só lugar.

## 3. Gestão de Frotas

### 3.1 Veículos
Organizado por **contrato de locação**: cada contrato (nº, data, locadora) agrupa uma lista de veículos com placa, condutor, status, km de retirada, km atual, observação e projeto vinculado. Quilometragem total é somada automaticamente. Permite atualização em lote via upload de arquivo.

### 3.2 Despesas
Despesas por veículo (placa): data de lançamento, data de início de pagamento, quem cadastrou, data de cadastro, parcelamento (nº de parcelas), valor da parcela, valor total, descrição. Também aceita atualização em lote via upload de arquivo. Conceito equivalente ao "Controle de Descontos" que já existe no sistema de despesas de vocês, só que aplicado à frota em vez de a pessoas.

## 4. Suprimentos

### 4.1 Controle de Estoque
Posição de estoque por produto: código, SKU, estoque físico, unidade, localização.

### 4.2 Compras (Ordens de Compra)
Situação, número do pedido, data, previsão de entrega, fornecedor, valor total, marcadores.

### 4.3 Solicitação de Material
Fluxo de aprovação: colaborador solicita material (status inicial "Aguardando"); registros trazem solicitação, data, status, solicitante, sigla, obra, descrição, unidade. Botão **"Gerar Pedido de Compra"** converte a solicitação aprovada diretamente numa Ordem de Compra — é a integração-chave entre Solicitação e Compras.

### 4.4 Requisição de Material
Retirada/reserva de itens já em estoque (estrutura de colunas semelhante ao Controle de Estoque: produto, SKU, estoque físico, unidade, localização).

### 4.5 Patrimônio
Ativos físicos (notebooks, celulares etc.) atribuídos a uma pessoa responsável: tipo, modelo, número de série, código de patrimônio, valor, status (em uso, manutenção etc.). Vincula-se diretamente ao cadastro de Pessoas.

## 5. Configurações

### 5.1 Controle de Acesso
Cadastro de usuários do sistema (nome, e-mail, senha, status ativo). Cada usuário tem permissões **granulares por módulo** (não é só um "cargo" fixo): abas Cadastros / Gestão de Frotas / Suprimentos / Configurações, cada uma com checkboxes individuais por funcionalidade (ex.: em Cadastros: Pessoas, Produtos, Empresas, Equipe, Visualizar Documentos, Baixar Documentos — cada uma marcável independente). Existe também um "Selecionar Todos".

## 6. Mapa de integrações entre módulos

- **Empresas ↔ Veículos / Colaboradores**: uma empresa PJ terceirizada pode ter veículos e pessoas vinculados diretamente a ela.
- **Pessoas ↔ Equipe / Projeto / Operadora / Cargo / Cargo ASO / Empresa**: o cadastro de pessoa referencia todos esses catálogos.
- **Pessoas ↔ Treinamentos/Exames ↔ Dashboard**: cada lançamento de treinamento/exame por pessoa alimenta os indicadores de compliance do dashboard.
- **Pessoas ↔ Patrimônio**: equipamentos (celular, notebook) são atribuídos a uma pessoa responsável.
- **Produtos ↔ Estoque ↔ Requisição ↔ Solicitação ↔ Compras**: cadeia de suprimentos — produto cadastrado, controlado em estoque, requisitado internamente ou solicitado (gerando compra quando aprovado).
- **Veículos ↔ Despesas ↔ Locadora**: veículo pertence a um contrato de locação (locadora) e acumula despesas vinculadas à placa.
- **Documentos**: módulo transversal, anexa-se a registros de qualquer outro módulo.
- **Controle de Acesso**: permissões por módulo controlam o que cada usuário do sistema pode ver/fazer nos demais módulos.

## 7. Achado de segurança relevante (contexto, não é o foco deste documento)

Durante a navegação foi identificado que o sistema usa autenticação baseada apenas em `localStorage` no navegador (sem token de sessão real validado pelo servidor a cada requisição), e que o formulário de edição de usuário do próprio Controle de Acesso pré-carrega a senha atual no campo — o mesmo padrão que identificamos e corrigimos no sistema de despesas de vocês. Isso não é algo que dá para corrigir aqui (é do fornecedor), mas é um ponto a considerar no desenho do sistema próprio: login validado no servidor, sem senha nunca trafegando de volta ao navegador.

## 8. Próximos passos sugeridos

1. Confirmar com a equipe quais desses módulos são realmente usados no dia a dia (alguns podem estar sub-utilizados).
2. Priorizar: provavelmente Cadastros (Pessoas/Empresas) + Treinamentos/Exames é o núcleo mais crítico (compliance regulatório), seguido de Gestão de Frotas.
3. Definir se Suprimentos (estoque/compras) entra na primeira versão ou fica para uma fase 2.
4. Planejar o modelo de permissões desde o início no formato granular por módulo, já que é assim que a equipe está acostumada a trabalhar hoje.
