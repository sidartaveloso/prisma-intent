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
atualizado_em: 2026-10-10
---

# PRISMA Intent como produto: monorepo próprio e pacotes publicados num registry privado

## Contexto

O PRISMA Intent nasceu dentro do repositório pessoal `sidartaveloso/sidartaveloso`, em `packages/prisma-intent-core`, `prisma-intent-work` e `prisma-intent-educar`, todos `private: true` na versão `0.1.0`. Uma quarta especialização, `prisma-intent-sales`, existe só num clone desse repositório (`sidartaveloso-sales`), que tem também uma cópia do core **divergente** da original (`src/index.ts` e `src/integridade.ts` diferentes, conferido em 2026-10-10).

Quem usa o Prisma fora do repositório de origem depende de ter o repositório clonado ao lado e aponta para ele por `link:`, e um CI que precise disso faz checkout de repositório privado com token. Cada consumidor pode estar compilando contra um core diferente sem saber.

Decisão de 2026-10-10 (Sidarta Veloso): **PRISMA Intent** é o nome do produto principal e deste repositório; o escopo npm continua `@prisma-intent/*`; os pacotes são publicados num registry npm privado (Verdaccio).

## Problema

Não há uma versão do Prisma: há cópias. Consumir exige acesso ao código-fonte e pasta irmã no lugar certo, e nada garante que dois consumidores estejam no mesmo core.

## Objetivo

1. Um monorepo só do Prisma, com o histórico de origem preservado.
2. Um core canônico, resultado de juntar as duas cópias.
3. Core e especializações publicados com versão no registry privado, para que qualquer consumidor instale por versão, com uma credencial de leitura, sem acesso ao código-fonte.
4. O método documentado em `apps/docs`.

## Escopo

- fundação do repositório: asdf, pnpm, turbo, taskin, Biome, OpenTask;
- core canônico a partir das duas cópias;
- `packages/core`, `packages/work`, `packages/educar` e `packages/sales` trazidos com histórico (`git filter-repo`);
- versionamento (changesets, em modo *fixed* no começo: core e especializações saem juntos) e publicação no registry, com `publishConfig.registry` e `access: restricted`;
- `apps/docs`: o método (gramática, a inversão "argumento antes da evidência", como criar uma especialização), em Vitepress, com testes de acessibilidade das páginas.

## Fora do escopo

- **A migração de cada consumidor**: é tarefa do repositório dele (trocar `link:` por versão, mapear o escopo no `.npmrc`, token de leitura como secret). Este repositório não conhece seus consumidores.
- **O registry em si**: Sidarta está configurando um Verdaccio novo; os requisitos de segurança (cadastro fechado, publicador nomeado, versões imutáveis, isolamento de rede) são de lá.
- **CLI `@prisma-intent/cli`** (`conferir`, `pendencias`, `emitir`): só quando dois consumidores precisarem das mesmas ferramentas. Hoje elas existem presas a uma instância (`scripts/conferir.ts` e `scripts/pendencias.ts` no repositório de origem) e repetidas por especialização (`scripts/emitir.ts` em work e educar).
- **Aplicação para montar instância sem programar**: outro produto, com outro cliente; só com demanda levantada, em pacote próprio.
- Remover o Prisma do repositório de origem e arquivar o clone `sidartaveloso-sales`: depois que os consumidores migrarem, no repositório de origem.

## Entregáveis

| Entregável | Descrição | Evidência esperada |
| --- | --- | --- |
| Fundação | asdf, pnpm, turbo, taskin, Biome, OpenTask | `pnpm lint`, `typecheck`, `test`, `build` verdes |
| Core canônico | uma versão a partir das duas cópias, com as diferenças decididas | diff das cópias e decisão registrada por diferença |
| Pacotes | core, work, educar, sales em `packages/`, com histórico | `git log --follow` de um arquivo mostra o histórico de origem |
| Publicação | changesets e publish no registry | `npm view @prisma-intent/core --registry <registry>` com a versão publicada |
| `apps/docs` | o método documentado | build e testes do docs verdes |

## Critérios de aceite

- [x] (A) O repositório tem asdf (`.tool-versions`), pnpm, turbo, taskin e Biome, e `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0.
- [ ] (A) Existe um core só; cada diferença entre as duas cópias tem decisão registrada.
- [ ] (A) Core e especializações estão em `packages/` com o histórico de origem preservado.
- [ ] (A) Nenhum pacote depende de outro por `link:` nem de caminho fora do repositório; especialização depende do core por `workspace:` e nenhuma depende de outra.
- [ ] (A) Os pacotes estão publicados no registry privado com `publishConfig.registry` e `access: restricted`, e instalam por versão com uma credencial de leitura.
- [ ] (A) Nenhum texto, código ou tarefa deste repositório cita um consumidor.
- [ ] (A) `apps/docs` publica o método, com build e testes verdes.
- [ ] (C) Revisão por Sidarta Veloso: o core canônico e o método documentado refletem o PRISMA Intent.

## Tarefas

Definições; viram Task na materialização, uma por vez.

| # | Tarefa | Complexidade | Entregável | Situação |
| --- | --- | --- | --- | --- |
| T1 | Fundação do repositório | baixa | asdf, pnpm, turbo, taskin, Biome, OpenTask | **concluída na task-001** |
| T2 | Core canônico | média | as duas cópias do core comparadas e unificadas, com a decisão de cada diferença | a materializar |
| T3 | Trazer core, work, educar e sales com histórico | média | `packages/*` com `git filter-repo`, gates verdes | a materializar; depende de T2 |
| T4 | Versionamento e publicação | média | changesets *fixed*, `publishConfig`, publish no registry | a materializar; **bloqueada pelo registry novo** |
| T5 | `apps/docs` com o método | média | Vitepress com testes das páginas | a materializar; pode correr em paralelo a T4 |

## Funções e responsáveis

- Responsável pelo pacote, líder técnico e decisor: Sidarta Veloso.
- Desenvolvedor: Sidarta Veloso (com agente como ferramenta; o agente não é pessoa nem função).

## Dependências

- **Registry npm privado** (Verdaccio novo, em configuração por Sidarta): bloqueia T4. Só entra em uso com cadastro fechado e publicação restrita a usuários nomeados.
- **Organização `prisma-intent` no npmjs**: em 2026-10-10 `https://registry.npmjs.org/-/org/prisma-intent` respondia 404, isto é, qualquer pessoa pode criá-la. Registrá-la (sem publicar nada lá) faz um cliente sem a linha do escopo no `.npmrc` falhar fechado para sempre. Sem ela, o escopo precisa ficar no registry **sem proxy** para o npmjs.

## Riscos

| Risco | Impacto | Tratamento |
| --- | --- | --- |
| Registry com cadastro aberto: qualquer conta lê o código ou publica versão maliciosa | Alto | Não publicar antes de o registry ter cadastro fechado e publicador nomeado |
| Terceiro registra `@prisma-intent` no npmjs e um cliente sem `.npmrc` instala o pacote dele | Alto | Registrar a org no npmjs; escopo sem proxy enquanto isso |
| Juntar os cores quebra um consumidor que dependia da cópia divergente | Médio | Decidir cada diferença em T2; versão nova sai com changeset descrevendo a quebra |
| Publicação acidental no npmjs | Médio | `publishConfig.registry` obrigatório e `access: restricted` |

## Evidências obrigatórias

- saída dos gates (`pnpm lint`, `typecheck`, `test`, `build`) a cada tarefa;
- diff das duas cópias do core e a decisão de cada diferença (T2);
- `git log --follow` mostrando o histórico de origem (T3);
- `npm view` no registry com as versões publicadas (T4).

## Política de revisão

Revisão pelo próprio demandante (parecer decisório), por PR em `develop`.

## Eventos

- 2026-10-10 — pacote criado: o PRISMA Intent sai do repositório pessoal e vira produto, com o escopo `@prisma-intent/*` e publicação num registry privado (Sidarta Veloso, decisor).
- 2026-10-10 — task-001 aberta: fundação do repositório (Sidarta Veloso, desenvolvedor).
- 2026-10-10 — task-001 concluída: ferramental e gates verdes; repositório local, sem remoto (Sidarta Veloso, desenvolvedor).

## Resultado

## Aprendizado
