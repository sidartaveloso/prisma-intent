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
- [ ] (A) `pnpm build` gera o `dist` de cada pacote; o tarball do `pnpm pack` leva só `dist`, `README.md`, `LICENSE` e o `package.json`, com `exports` apontando para o `dist`
- [ ] (A) O portão de carga empacota cada pacote, instala num consumidor fora do workspace e carrega no Node ESM: os seis carregam, e o bin do `work` inicia
- [ ] (A) `import … from "prisma-intent/work"` resolve para `@prisma-intent/work`, e o mesmo para as outras especializações (teste)
- [ ] (A) `.changeset/config.json` com os seis pacotes num grupo `fixed`, `access: public`, base `main`
- [ ] (A) Workflow de release com `id-token: write`, actions fixadas por SHA, gates, portão de carga e `changeset publish`
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta reserva os nomes e configura o *trusted publishing* (2FA)
- [ ] (A) A 0.1.0 dos seis pacotes está no npm, publicada pelo GitHub Actions, com proveniência, e com release no GitHub

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Build e `publishConfig` de cada pacote
- [ ] Alias `prisma-intent`
- [ ] Changesets
- [ ] Portão de carga
- [ ] Workflow de release
- [ ] Script de reserva dos nomes e da confiança, para Sidarta rodar
- [ ] Gates

## Notes
Pacote: 2026-000001. Depende das tasks 006 a 008 (os pacotes na `develop`).
