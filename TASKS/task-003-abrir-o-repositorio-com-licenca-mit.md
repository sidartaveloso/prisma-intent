# 🧩 Task 003 — Abrir o repositório, com licença MIT e os recursos de segurança do GitHub

- Status: done
- Type: chore
- Assignee: sidartaveloso

## Description
Decisões de Sidarta em 2026-10-11: a licença do PRISMA Intent é **MIT**; o repositório **já nasce público**, para usar os recursos de segurança do GitHub; e os pacotes do próprio Sidarta podem ser usados **imediatamente**, sem a quarentena de 3 dias.

- `LICENSE` (MIT) e `"license": "MIT"` no `package.json`; o README e o SECURITY.md acompanham;
- `minimumReleaseAgeExclude` com os escopos de Sidarta: `@prisma-intent/*`, `@opentask/*` e `taskin`;
- antes de abrir: o histórico inteiro passa no gitleaks;
- abrir o repositório e ligar: secret scanning com push protection, alertas e atualizações de segurança do Dependabot, relato privado de vulnerabilidade, CodeQL e regras de branch para `main` e `develop`.

## Acceptance criteria
- [x] (A) `LICENSE` MIT e `"license": "MIT"`; nenhum `UNLICENSED` sobra
- [x] (A) Os escopos de Sidarta estão fora da quarentena; o resto continua com 3 dias
- [x] (A) O histórico inteiro passa no gitleaks antes de o repositório ser aberto
- [x] (A) O repositório é público
- [x] (A) Secret scanning com push protection, Dependabot (alertas e atualizações de segurança) e relato privado de vulnerabilidade ligados
- [x] (A) CodeQL configurado
- [x] (A) `main` e `develop` sem exclusão nem force push; `main` só por PR com o CI verde

## Tasks
<!-- [x] feito · [ ] em aberto -->
- [x] Licença MIT
- [x] Exceção da quarentena
- [x] Varredura final e push
- [x] Abrir e ligar os recursos do GitHub

## Notes
Pacote: 2026-000001

Evidência (2026-10-11):
- `LICENSE` MIT e `"license": "MIT"`; `minimumReleaseAgeExclude` com `@prisma-intent/*`, `@opentask/*` e `taskin` (Sidarta é o mantenedor no npm);
- gitleaks v8.30.1 no histórico inteiro antes de abrir: `no leaks found`;
- `gh repo view`: `PUBLIC`; `security_and_analysis`: secret scanning, push protection e Dependabot security updates `enabled`; alertas do Dependabot e relato privado de vulnerabilidade ligados;
- CodeQL: default setup `configured`, suíte `extended`, ainda sem linguagens — analisa a `main`, que só tem a fundação; detecta Actions e TypeScript quando código e workflows chegarem lá;
- rulesets ativos: `main e develop: sem exclusão nem force push` (24888971) e `main: só por PR com o CI verde` (24888973), exigindo os três jobs do CI;
- primeiro CI, no push de `f8b62b8` para `develop`: `success` (run 38163904382).

Padrões genéricos de segredo e checagem de validade do secret scanning não ligaram: são do GitHub Advanced Security, pago também em repositório público.
