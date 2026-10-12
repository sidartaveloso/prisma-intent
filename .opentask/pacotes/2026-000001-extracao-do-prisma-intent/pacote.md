---
id: "2026-000001"
tipo: pacote
status: em_execucao
modo: agencia
visibilidade: interna
metodologia_versao: "0.1"
estrutura_versao: "2"
regra_devbits_versao: "0.1"
fonte_oficial: true
criado_em: 2026-10-10
atualizado_em: 2026-10-11
---

# PRISMA Intent como produto: monorepo próprio, aberto, com pacotes publicados no npmjs

## Contexto

O PRISMA Intent nasceu dentro do repositório pessoal `sidartaveloso/sidartaveloso`, em `packages/prisma-intent-core`, `prisma-intent-work` e `prisma-intent-educar`, todos `private: true` na versão `0.1.0`. Uma quarta especialização, `prisma-intent-sales`, existe só num clone desse repositório (`sidartaveloso-sales`), que tem também uma cópia do core **divergente** da original (`src/index.ts` e `src/integridade.ts` diferentes, conferido em 2026-10-10).

Quem usa o Prisma fora do repositório de origem depende de ter o repositório clonado ao lado e aponta para ele por `link:`, e um CI que precise disso faz checkout de repositório privado com token. Cada consumidor pode estar compilando contra um core diferente sem saber.

Decisão de 2026-10-10 (Sidarta Veloso): **PRISMA Intent** é o nome do produto principal e deste repositório; o escopo npm continua `@prisma-intent/*`; os pacotes seriam publicados num registry npm privado (Verdaccio) — substituído pela decisão de 2026-10-11 abaixo.

Decisão de 2026-10-11 (Sidarta Veloso): a especialização **Educar passa a se chamar `educate`**, como `work` e `sales` — nomes de especialização em inglês. Muda o pacote (`@prisma-intent/educar` → `@prisma-intent/educate`), a pasta (`packages/educate`) e o literal `especializacao: "educar"` (em `src/brief.ts` e `scripts/emitir.ts`), que nas outras especializações é igual ao nome do pacote. Os identificadores e o vocabulário internos continuam em português.

Decisão de 2026-10-11 (Sidarta Veloso): **posicionamento** — *A typed, structured way to think, build, fix, communicate, provide — and be.* A comunicação deixa de ser a definição do produto e passa a ser a **primeira aplicação** de uma abordagem mais ampla (Think, Build, Fix, Communicate, Provide, Be). Para a primeira publicação vale a **opção 2**: o core fica como está — a gramática da comunicação — e o README diz que só Communicate está implementado. Crescer o core com os conceitos genéricos de Think, Build e Fix (problema, estado desejado, hipótese, ação permitida, invariante, critério de aceite), com a comunicação virando uma camada sobre ele, é **decisão em aberto**, para um pacote próprio depois desta extração.

Decisão de 2026-10-11 (Sidarta Veloso): **alias `prisma-intent`**, sem escopo, livre no npmjs em 2026-10-11. É um pacote fino, sem código próprio: depende do core e das especializações e os reexporta por subcaminho (`prisma-intent` é o core, `prisma-intent/work`, `prisma-intent/educate`, `prisma-intent/sales`). Sai no mesmo grupo *fixed* do changesets, na mesma versão e no mesmo release dos demais. Protege o nome que alguém digitaria depois de ler o README e serve de porta de entrada; quem quer só uma parte instala o pacote com escopo. `prismaintent` e `prisma_intent` **não** são publicados: o npmjs recusa nome que, sem pontuação, coincide com um pacote existente, então publicar `prisma-intent` já os protege — e pacote vazio só para ocupar nome vai contra a política de *name squatting* do npmjs.

Decisão de 2026-10-11 (Sidarta Veloso): **o `educate` não é limitado a crianças.** Hoje o pacote de origem está amarrado a um produto: público de 1 a 12 anos, `PerfilDeCrianca`, conceitos e nomes próprios do produto, `Casa` com QR e canal de mensagem, e cada tipo cita o ID de um book de domínio que é do consumidor. Na T3, o `educate` é **generalizado**: fica o que vale para educação em qualquer idade (quem aprende, quem decide e quem acompanha; intenção e objetivo observável; tema e sua origem; histórias, missões e rotina; estágio de desenvolvimento como dado; regras de integridade); o que é do produto (faixas, nomes, canais, referências ao book) volta para a instância, no repositório do consumidor.

Decisão de 2026-10-11 (Sidarta Veloso): com o repositório aberto e a licença MIT, **os pacotes são publicados no npmjs, não no Verdaccio**, na organização `prisma-intent`, com `access: public` e procedência (*provenance*) assinada pelo GitHub Actions. **Cada versão tem um release no GitHub**, com as notas do changeset. Sidarta **aprova o README** antes da primeira publicação.

Decisão de 2026-10-11 (Sidarta Veloso): **o PRISMA Intent será tornado público depois**, e **o histórico do Prisma não vem** para este repositório. O código entra como cópia, num commit que registra a procedência (repositório e commit de origem de cada pacote); o passado fica no repositório de origem. Consequência, reforçada por Sidarta no mesmo dia: **nada no PRISMA Intent pode ser privado; tudo nele deve poder ser exposto** — código, testes, documentação, registros OpenTask e mensagens de commit. Este repositório é escrito desde já como público.

Hoje o `work` não pode ser copiado inteiro: `src/instancias/` guarda uma **instância real**, com dados de uma pessoa, e dela dependem `src/index.ts` (que reexporta `instancias/codigos.ts`), os testes `conferencia`, `experiencia` e `procedencia` e os scripts `emitir.ts` e `verificar-publicacao.ts`. Instância é do consumidor, não do produto (AGENTS.md): ela fica no repositório de origem, e os testes daqui passam a usar uma instância fictícia.

## Problema

Não há uma versão do Prisma: há cópias. Consumir exige acesso ao código-fonte e pasta irmã no lugar certo, e nada garante que dois consumidores estejam no mesmo core.

## Objetivo

1. Um monorepo só do Prisma, sem o histórico de origem e pronto para ser aberto.
2. Um core canônico, resultado de juntar as duas cópias.
3. Core e especializações publicados com versão no npmjs, para que qualquer consumidor instale por versão, sem credencial nem `.npmrc` especial, e cada versão com um release no GitHub.
4. O método documentado em `apps/docs`.

## Escopo

- fundação do repositório: asdf, pnpm, turbo, taskin, Biome, OpenTask;
- core canônico a partir das duas cópias;
- `packages/core`, `packages/work`, `packages/educate` e `packages/sales` copiados **sem histórico**, com a procedência no commit, a troca de `educar` para `educate` e sem instância real (testes com instância fictícia);
- preparação para abrir o repositório: licença escolhida, varredura de segredos e de dados pessoais, gitleaks no pre-commit e no CI;
- versionamento (changesets, em modo *fixed* no começo: core e especializações saem juntos), publicação no npmjs pelo CI com *provenance* (`publishConfig.access: public`) e release no GitHub para cada versão;
- README aprovado por Sidarta antes da primeira publicação (é a página do pacote no npmjs e a entrada do repositório);
- `apps/docs`: o método (gramática, a inversão "argumento antes da evidência", como criar uma especialização), em Vitepress, com testes de acessibilidade das páginas.

## Fora do escopo

- **A migração de cada consumidor**: é tarefa do repositório dele (trocar o `link:` pela versão publicada).
- **CLI `@prisma-intent/cli`** (`conferir`, `pendencias`, `emitir`): só quando dois consumidores precisarem das mesmas ferramentas. Hoje elas existem presas a uma instância (`scripts/conferir.ts` e `scripts/pendencias.ts` no repositório de origem) e repetidas por especialização (`scripts/emitir.ts` em work e educate).
- **Crescer o core para Think, Build e Fix** (problema, estado desejado, hipótese, ação permitida, invariante, critério de aceite), com a comunicação como camada sobre ele: decisão em aberto, em pacote próprio.
- **Aplicação para montar instância sem programar**: outro produto, com outro cliente; só com demanda levantada, em pacote próprio.
- Remover o Prisma do repositório de origem e arquivar o clone `sidartaveloso-sales`: depois que os consumidores migrarem, no repositório de origem.

## Entregáveis

| Entregável | Descrição | Evidência esperada |
| --- | --- | --- |
| Fundação | asdf, pnpm, turbo, taskin, Biome, OpenTask | `pnpm lint`, `typecheck`, `test`, `build` verdes |
| Core canônico | uma versão a partir das duas cópias, com as diferenças decididas | diff das cópias e decisão registrada por diferença |
| Pacotes | core, work, educate, sales em `packages/`, sem histórico e sem instância real | commit de entrada com a procedência; busca por dados pessoais e de empregador vazia |
| Prontidão para abrir | licença, varredura de segredos e de dados pessoais, gitleaks | relatório do gitleaks sobre o histórico inteiro, vazio |
| Publicação | changesets, publish no npmjs com *provenance* e release no GitHub | `npm view @prisma-intent/core` com a versão e a procedência; release da versão no GitHub |
| `apps/docs` | o método documentado | build e testes do docs verdes |

## Critérios de aceite

- [x] (A) O repositório tem asdf (`.tool-versions`), pnpm, turbo, taskin e Biome, e `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0.
- [ ] (A) Existe um core só; cada diferença entre as duas cópias tem decisão registrada.
- [ ] (A) Core e especializações estão em `packages/`, sem o histórico de origem, com a procedência (repositório e commit) registrada no commit de entrada.
- [ ] (A) Nada privado no repositório, em arquivo nem em histórico: nenhuma instância real (os testes usam instância fictícia), nenhum dado de pessoa, empregador ou cliente real, nenhum segredo. A única identificação pessoal é a autoria (nome e e-mail de quem commita e o cadastro no taskin).
- [x] (A) Licença MIT (decisão de Sidarta, 2026-10-11) declarada em `LICENSE` e nos `package.json` antes de o repositório ser aberto.
- [x] (A) gitleaks no pre-commit e no CI, e o histórico inteiro deste repositório passa limpo.
- [ ] (A) A especialização Educar está publicada como `@prisma-intent/educate`, com `especializacao: "educate"`; nenhum `educar` sobra em nome de pacote, pasta ou literal de especialização.
- [ ] (A) O `educate` vale para qualquer idade: nenhuma faixa etária fixa, nenhum conceito ou nome de produto, nenhuma referência a book ou repositório de consumidor.
- [ ] (A) Os blocos `ts` do README compilam: um teste os extrai e roda o `tsc` contra os pacotes, e o erro esperado do exemplo é conferido por `@ts-expect-error`.
- [ ] (A) Nenhum pacote depende de outro por `link:` nem de caminho fora do repositório; especialização depende do core por `workspace:` e nenhuma depende de outra.
- [ ] (A) Os pacotes estão publicados no npmjs, na org `prisma-intent`, com `access: public` e *provenance*, e instalam por versão sem credencial.
- [ ] (A) Cada versão publicada tem um release no GitHub, com a tag e as notas do changeset.
- [ ] (A) O alias `prisma-intent` está publicado na mesma versão dos demais, sem código próprio, e `import ... from "prisma-intent/work"` resolve para `@prisma-intent/work` (teste).
- [x] (C) README aprovado por Sidarta antes da primeira publicação (2026-10-11, com o novo posicionamento).
- [ ] (A) `apps/docs` publica o método, com build e testes verdes.
- [ ] (C) Revisão por Sidarta Veloso: o core canônico e o método documentado refletem o PRISMA Intent.

## Tarefas

Definições; viram Task na materialização, uma por vez.

| # | Tarefa | Complexidade | Entregável | Situação |
| --- | --- | --- | --- | --- |
| T1 | Fundação do repositório | baixa | asdf, pnpm, turbo, taskin, Biome, OpenTask | **concluída na task-001** |
| T2 | Core canônico | média | as duas cópias do core comparadas e unificadas, com a decisão de cada diferença | a materializar |
| T3 | Trazer core, work, educate e sales | alta | `packages/*` copiados **sem histórico**, procedência no commit, `educar` renomeado para `educate` (pacote, pasta e literal `especializacao`) e **generalizado para qualquer idade**, instância real fora e testes com instância fictícia, exemplos do README compilados por teste, gates verdes | a materializar; depende de T2 |
| T4 | Versionamento, publicação e release | média | changesets *fixed*, publish no npmjs pelo CI com *provenance*, release no GitHub, alias `prisma-intent` reexportando por subcaminho | a materializar; depende de T3 (org criada, README aprovado) |
| T5 | `apps/docs` com o método | média | Vitepress com testes das páginas | a materializar; pode correr em paralelo a T4 |
| T6 | Prontidão para abrir o repositório | baixa | licença decidida, gitleaks no pre-commit e no CI, varredura do histórico e de dados pessoais | mecanismos **materializados na task-002**; a licença, decisão de Sidarta, fica para antes da abertura |

## Funções e responsáveis

- Responsável pelo pacote, líder técnico e decisor: Sidarta Veloso.
- Desenvolvedor: Sidarta Veloso (com agente como ferramenta; o agente não é pessoa nem função).

## Dependências

- **Organização `prisma-intent` no npmjs**: **criada por Sidarta em 2026-10-11** (`https://registry.npmjs.org/-/org/prisma-intent` passou de 404 a 200, ainda sem pacotes). O escopo `@prisma-intent` está garantido; o nome sem escopo `prisma-intent` só fica garantido com a publicação do alias.
- **Publicação confiável (*trusted publishing*) no npmjs**: cada pacote aceita publicar só a partir do workflow deste repositório, por OIDC, sem token guardado. O npmjs só deixa configurar isso num pacote que já existe; a primeira versão de cada um é publicada por Sidarta, com 2FA, e o resto vem pelo CI.

## Riscos

| Risco | Impacto | Tratamento |
| --- | --- | --- |
| Terceiro registra a org `prisma-intent` ou publica o pacote `prisma-intent` no npmjs antes de Sidarta | Alto | Criar a org e publicar o alias antes de anunciar o nome |
| Confusão com o Prisma ORM (`prisma`, `@prisma/*` e os plugins `prisma-*`; "Prisma" é marca da Prisma Data) | Baixo | O README e a descrição dos pacotes deixam claro que não há relação |
| Token de publicação vazado publica versão maliciosa | Alto | *Trusted publishing* por OIDC, sem token guardado; 2FA obrigatório na conta e na org |
| Generalizar o `educate` tira do pacote conceitos que o consumidor atual usa | Médio | O que sai do pacote vai para a instância do consumidor, na task de migração dele; a primeira versão publicada já sai generalizada |
| A troca `educar` → `educate` quebra quem importa `@prisma-intent/educar` ou lê `especializacao: "educar"` de um brief emitido | Médio | A primeira versão publicada já sai como `educate` (nunca houve `educar` no registry); o changeset registra a troca para a migração dos consumidores |
| Juntar os cores quebra um consumidor que dependia da cópia divergente | Médio | Decidir cada diferença em T2; versão nova sai com changeset descrevendo a quebra |
| Dado pessoal ou de empregador entrar no repositório e ficar no histórico quando ele for aberto | Alto | Histórico do Prisma não vem; instância real fica fora; gitleaks e varredura antes de abrir (T6) |
| Versão errada publicada: no npmjs não se despublica depois de 72 horas | Médio | Publicação só pelo CI, a partir da `main`, depois do PR de versão do changesets; versão errada é corrigida com versão nova e `npm deprecate` |

## Evidências obrigatórias

- saída dos gates (`pnpm lint`, `typecheck`, `test`, `build`) a cada tarefa;
- diff das duas cópias do core e a decisão de cada diferença (T2);
- commit de entrada com a procedência e a busca por nomes reais vazia (T3);
- relatório do gitleaks sobre o histórico inteiro e a licença declarada (T6);
- `npm view` com as versões publicadas e a procedência, e o release no GitHub (T4).

## Política de revisão

Revisão pelo próprio demandante (parecer decisório), por PR em `develop`.

## Eventos

- 2026-10-10 — pacote criado: o PRISMA Intent sai do repositório pessoal e vira produto, com o escopo `@prisma-intent/*` e publicação num registry privado (Sidarta Veloso, decisor).
- 2026-10-10 — task-001 aberta: fundação do repositório (Sidarta Veloso, desenvolvedor).
- 2026-10-10 — task-001 concluída: ferramental e gates verdes; repositório local, sem remoto (Sidarta Veloso, desenvolvedor).
- 2026-10-11 — a especialização Educar passa a se chamar `educate` (pacote, pasta e literal `especializacao`), na T3 (Sidarta Veloso, decisor).
- 2026-10-11 — repositório remoto criado, privado: github.com/sidartaveloso/prisma-intent (Sidarta Veloso, decisor).
- 2026-10-11 — task-002 aberta: mecanismos de segurança (gitleaks, quarentena de dependências, CI, Dependabot), parte da T6 (Sidarta Veloso, desenvolvedor).
- 2026-10-11 — organização `prisma-intent` criada no npmjs por Sidarta (Sidarta Veloso, decisor).
- 2026-10-11 — alias `prisma-intent` sem escopo, reexportando o core e as especializações; `prismaintent` e `prisma_intent` ficam protegidos pela regra de similaridade do npmjs, sem publicar nada (Sidarta Veloso, decisor).
- 2026-10-11 — README aprovado por Sidarta, com o posicionamento *think, build, fix, communicate, provide — and be*; opção 2: o core fica como está na primeira publicação e só Communicate é apresentado como implementado; crescer o core é decisão em aberto (Sidarta Veloso, decisor).
- 2026-10-11 — o `educate` é generalizado antes da primeira publicação; o repositório não traz a frase "não conhece quem o consome", que é verdade mas não precisa ser dita (Sidarta Veloso, decisor).
- 2026-10-11 — o `educate` não é limitado a crianças: generalizado na T3, com o que é do produto voltando para a instância; os exemplos do README passam a ser compilados por teste; o README fica em português, com os nomes de pacote em inglês (Sidarta Veloso, decisor).
- 2026-10-11 — publicação no npmjs, não no Verdaccio, com *provenance* e release no GitHub para cada versão; README aprovado por Sidarta antes da primeira publicação (Sidarta Veloso, decisor).
- 2026-10-11 — licença MIT; o repositório já nasce público, com os recursos de segurança do GitHub; os pacotes de Sidarta ficam fora da quarentena; task-003 aberta (Sidarta Veloso, decisor).
- 2026-10-11 — task-003 concluída: MIT, repositório público com secret scanning e push protection, Dependabot, relato privado de vulnerabilidade, CodeQL e regras de branch; primeiro CI verde (Sidarta Veloso, desenvolvedor).
- 2026-10-11 — task-002 concluída: gitleaks com regras de dado pessoal no pre-commit e no CI, quarentena de 3 dias no pnpm, CI com permissão mínima e actions por SHA, `pnpm audit`, Dependabot e SECURITY.md (Sidarta Veloso, desenvolvedor).
- 2026-10-11 — o PRISMA Intent será tornado público depois; o histórico do Prisma não vem, a instância real do `work` fica no repositório de origem e entra a T6, de prontidão para abrir (Sidarta Veloso, decisor).

## Resultado

## Aprendizado
