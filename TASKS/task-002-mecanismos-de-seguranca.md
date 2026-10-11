# 🧩 Task 002 — Mecanismos de segurança

- Status: done
- Type: chore
- Assignee: sidartaveloso

## Description
O PRISMA Intent será público, e nada nele pode ser privado (AGENTS.md). Antes de o código chegar, o repositório ganha os mecanismos que impedem segredo e dado pessoal de entrar, e que protegem a cadeia de dependências:

- **gitleaks** com as regras padrão e regras próprias de dado pessoal (e-mail fora dos admitidos, CPF, CNPJ, telefone), no pre-commit (lefthook) e no CI, varrendo o histórico inteiro;
- **quarentena de dependências**: o pnpm não instala versão publicada há menos de 3 dias (`minimumReleaseAge`), e scripts de instalação só rodam para pacotes listados;
- **CI** com permissão mínima (`contents: read`), actions fixadas por SHA, gates (`lint`, `typecheck`, `test`, `build`) e `pnpm audit`;
- **Dependabot** para npm e GitHub Actions;
- **SECURITY.md** com o canal de relato.

É a parte de mecanismos da T6 do pacote 2026-000001. A escolha da licença, que também é da T6, fica fora: é decisão de Sidarta.

## Acceptance criteria
- [x] (A) `.gitleaks.toml` com as regras padrão e as de dado pessoal; cada exceção diz por que existe
- [x] (A) As regras pegam um segredo, um e-mail pessoal, um CPF, um CNPJ e um telefone de teste, e deixam passar o e-mail da autoria e os domínios de exemplo (conferido com arquivos temporários)
- [x] (A) O histórico inteiro do repositório passa no gitleaks
- [x] (A) O pre-commit roda o gitleaks no que está no stage (lefthook), com o binário local ou a imagem Docker na mesma versão do CI
- [x] (A) pnpm com `minimumReleaseAge` e scripts de instalação só para pacotes listados
- [x] (A) CI com `permissions: contents: read`, actions fixadas por SHA, gates, gitleaks no histórico e `pnpm audit`
- [x] (A) Dependabot para npm e GitHub Actions; SECURITY.md
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` verdes

## Tasks
<!-- [x] feito · [ ] em aberto -->
- [x] gitleaks: configuração, pre-commit e CI
- [x] Quarentena e scripts de instalação no pnpm
- [x] CI, Dependabot e SECURITY.md
- [x] Conferir as regras com arquivos temporários e varrer o histórico

## Notes
Pacote: 2026-000001

Evidência (2026-10-11, local, gitleaks v8.30.1 pela imagem oficial):
- arquivos temporários fictícios: um token, um e-mail pessoal, um CPF, um CNPJ e um telefone reprovaram (`github-pat`, `dado-pessoal-email`, `-cpf`, `-cnpj`, `-telefone`); a autoria, `example.com`, `.test`, `noreply`, datas, versões e números sem máscara passaram;
- o histórico inteiro e a árvore de trabalho: `no leaks found`;
- o gancho do lefthook com um e-mail fictício no stage: saída 1, `dado-pessoal-email`;
- a quarentena barrou o `@types/node` 26.6.5 (publicado havia 45 horas); o lockfile foi refeito com ela valendo;
- `pnpm audit --audit-level high`: nenhuma vulnerabilidade; `pnpm lint`, `typecheck`, `test` e `build` com código 0.

O CI ainda não rodou: roda no primeiro push.

O pnpm passou de 10.15.1 para 10.33.3 (`.tool-versions` e `packageManager`), a primeira linha da 10 com `minimumReleaseAge` já instalada pelo asdf nesta máquina.

Configurações do GitHub (secret scanning com push protection, regras de branch, CodeQL) não entram aqui: em repositório privado dependem de plano pago, e ficam para quando o repositório for aberto.
