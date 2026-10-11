# 🧩 Task 003 — Abrir o repositório, com licença MIT e os recursos de segurança do GitHub

- Status: in-progress
- Type: chore
- Assignee: sidartaveloso

## Description
Decisões de Sidarta em 2026-10-11: a licença do PRISMA Intent é **MIT**; o repositório **já nasce público**, para usar os recursos de segurança do GitHub; e os pacotes do próprio Sidarta podem ser usados **imediatamente**, sem a quarentena de 3 dias.

- `LICENSE` (MIT) e `"license": "MIT"` no `package.json`; o README e o SECURITY.md acompanham;
- `minimumReleaseAgeExclude` com os escopos de Sidarta: `@prisma-intent/*`, `@opentask/*` e `taskin`;
- antes de abrir: o histórico inteiro passa no gitleaks;
- abrir o repositório e ligar: secret scanning com push protection, alertas e atualizações de segurança do Dependabot, relato privado de vulnerabilidade, CodeQL e regras de branch para `main` e `develop`.

## Acceptance criteria
- [ ] (A) `LICENSE` MIT e `"license": "MIT"`; nenhum `UNLICENSED` sobra
- [ ] (A) Os escopos de Sidarta estão fora da quarentena; o resto continua com 3 dias
- [ ] (A) O histórico inteiro passa no gitleaks antes de o repositório ser aberto
- [ ] (A) O repositório é público
- [ ] (A) Secret scanning com push protection, Dependabot (alertas e atualizações de segurança) e relato privado de vulnerabilidade ligados
- [ ] (A) CodeQL configurado
- [ ] (A) `main` e `develop` sem exclusão nem force push; `main` só por PR com o CI verde

## Tasks
<!-- [x] feito · [ ] em aberto -->
- [ ] Licença MIT
- [ ] Exceção da quarentena
- [ ] Varredura final e push
- [ ] Abrir e ligar os recursos do GitHub

## Notes
Pacote: 2026-000001
