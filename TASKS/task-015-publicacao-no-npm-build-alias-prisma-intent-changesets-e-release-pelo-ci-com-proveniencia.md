# 🧩 Task 015 — Publicação no npm: build, alias prisma-intent, changesets e release pelo CI com proveniência

- Status: in-progress
- Type: feat
- Assignee: sidartaveloso

## Description
T4 do pacote 2026-000001. Pedido de Sidarta em 23/11/2026: "bora publicar, pois o geohub também precisará usar" e "pode publicar, não tem problema quebrar, depois eu ajusto. se o prospeccao ainda não está disponível, não tem problema. Fazemos sem ele."

Hoje os pacotes exportam o fonte `.ts` e estão `private: true`. O Node não remove tipos de arquivo dentro de `node_modules`: publicado assim, nenhum consumidor carrega. A T4 entrega:

1. **build**: cada pacote compila para `dist/` (JavaScript ESM e `.d.ts`), e o que vai para o npm é o `dist`, pelo `publishConfig` do pnpm. Dentro do monorepo os pacotes continuam se vendo pelo fonte, como hoje;
2. **o alias `prisma-intent`**, sem escopo: `prisma-intent` reexporta o core, e `prisma-intent/work`, `/educate`, `/sales` e `/funding`, cada especialização;
3. **changesets em modo `fixed`**: core, especializações e alias saem sempre juntos, na mesma versão;
4. **workflow de release**: push na `main` roda os gates, o portão de carga e o `changeset publish` por *trusted publishing* (OIDC), com proveniência, e cria o release no GitHub de cada versão;
5. **portão de carga**: antes de publicar, cada pacote é empacotado e carregado no Node ESM num consumidor limpo, como sai para o registry — a lição do taskin 5.2.0, que saiu publicado sem carregar;
6. **a primeira publicação**: o npm só configura *trusted publishing* para pacote que já existe. Sidarta reserva os seis nomes com uma versão `0.0.0-stage` (dist-tag `stage`) e configura a confiança, com o 2FA dele; a 0.1.0 sai pelo CI, com proveniência.

Fica fora: a `prospeccao`, que não está neste repositório; a lacuna com sustentação (task-005), que entra depois; a migração dos consumidores; `apps/docs` (T5).

## Acceptance criteria
- [x] (A) `pnpm build` gera o `dist` de cada pacote; o tarball do `pnpm pack` leva só `dist`, `README.md`, `LICENSE` e o `package.json`, com `exports` apontando para o `dist`
- [x] (A) O portão de carga empacota cada pacote, instala num consumidor fora do workspace e carrega no Node ESM: os seis carregam, e o bin do `work` inicia
- [x] (A) `import … from "prisma-intent/work"` resolve para `@prisma-intent/work`, e o mesmo para as outras especializações (teste)
- [x] (A) `.changeset/config.json` com os seis pacotes num grupo `fixed`, `access: public`, base `main`
- [x] (A) Workflow de release com `id-token: write`, actions fixadas por SHA, gates, portão de carga e `changeset publish`
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta reserva os nomes e configura o *trusted publishing* (2FA)
- [ ] (A) A 0.1.0 dos seis pacotes está no npm, publicada pelo GitHub Actions, com proveniência, e com release no GitHub

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Build e `publishConfig` de cada pacote
- [x] Alias `prisma-intent`
- [x] Changesets
- [x] Portão de carga
- [x] Workflow de release
- [x] Script de reserva dos nomes e da confiança, para Sidarta rodar
- [x] Gates

## Notes
Pacote: 2026-000001. Depende das tasks 006 a 008 (os pacotes na `develop`).

Evidência (2026-11-23, local, na `feat/task-015`, commits `134b96c`, `eeb3cfb` e `1f712bf`):

- `pnpm build`: o `dist` dos cinco pacotes, com JavaScript ESM, `.d.ts` e os imports relativos reescritos para `.js`. O tarball do core leva 39 arquivos: `package.json`, `README.md`, `LICENSE` e `dist/`; o `package.json` publicado aponta `exports` e `types` para o `dist`;
- `pnpm verificar:carga`: os seis pacotes empacotados, instalados num consumidor fora do workspace e carregados com `node`, inclusive os quatro subcaminhos do alias e o bin do `work`. Com o `publishConfig.exports` do core retirado de propósito, o portão reprova o core e quem depende dele;
- teste do alias: `prisma-intent` e cada `prisma-intent/<especialização>` são, por identidade, o pacote com escopo;
- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm audit --audit-level high`: código 0. gitleaks: `no leaks found`;
- `pnpm reservar:npm --dry-run` lista as duas operações por pacote, sem escrever no npm.

### Decisões tomadas aqui, para a leitura de Sidarta

- **O `funding` ganhou subcaminho no alias** (`prisma-intent/funding`), como as outras especializações. O pacote 2026-000001 deixava isso para a T4.
- **O pacote raiz passou a se chamar `prisma-intent-monorepo`.** Com o mesmo nome do alias, o pnpm confundia os dois em `--filter`.
- **O `npm` 11 entrou nas devDependencies.** O `npm trust` exige 11.15 ou mais novo, e o do Node 24.17 é o 11.13. O pnpm 10 publica chamando o npm, e a publicação por OIDC exige 11.5.1 ou mais novo.
- **A reserva usa `0.0.0-stage`**, com a dist-tag `stage`, como o taskin fez com pacotes novos: a 0.1.0 sai pelo CI, com proveniência.

### Para depois desta task

- O PR de versão que o changesets abre na `main` é criado pelo token do Actions, e um PR assim não dispara o CI. Como a regra da `main` exige o CI verde, o primeiro release com changeset vai precisar de um token próprio (app ou PAT) no `release.yml`, ou de um merge que contorne a regra. A 0.1.0 não passa por PR de versão: sai direto no push.

