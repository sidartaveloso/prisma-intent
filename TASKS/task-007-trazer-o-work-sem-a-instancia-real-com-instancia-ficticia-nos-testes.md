# 🧩 Task 007 — Trazer o work sem a instância real, com instância fictícia nos testes

- Status: in-review
- Type: feat
- Assignee: sidartaveloso

## Description
T3 do pacote 2026-000001, segunda de três partes: o `work`, de `packages/prisma-intent-work` do repositório de origem (commit `3d8bed2`, fixado na task-005) para `packages/work`.

O `work` não entra por cópia, como os da task-006. Na origem ele é a especialização **e** a primeira instância, e a instância é de uma pessoa real. Instância é de quem usa o pacote, não do pacote. O que muda:

- **`src/instancias/` não vem.** Fica na origem a instância e o mapa de códigos públicos; `src/index.ts` deixa de reexportar o mapa, e o `package.json` deixa de exportar `./instancias/*`.
- **Comentários e exemplos do código** citam, na origem, organizações, produtos e a oportunidade reais. Passam a usar nomes fictícios. O código não muda.
- **Testes** de conferência e de procedência rodavam sobre a instância real e sobre a fonte arquivada dela. Passam a rodar sobre uma instância fictícia (`test/exemplo.ts`) e uma fonte fictícia, citada literalmente.
- **Scripts** `emitir` e `prisma-verificar-publicacao` importavam a instância real. Passam a receber o módulo da instância por argumento.
- **Documentação** (`README.md`, `AGENTS.md`, `docs/`): sai o que descreve os apps e a instância do repositório de origem.
- **Exemplo do README da raiz**: entra o teste que o confere contra código compilado (critério do pacote).

## Acceptance criteria
- [x] (A) `packages/work` existe sem `src/instancias/`, e o commit de entrada registra repositório, commit e caminho de origem
- [x] (A) Nenhum nome real de pessoa, organização, produto, cliente ou oportunidade no pacote, em código, comentário, teste ou documentação; gitleaks limpo
- [x] (A) As diferenças de `src/` contra a origem estão listadas: só comentário, exceto `index.ts`
- [x] (A) Os testes de conferência, procedência e redação passam sobre a instância fictícia; a procedência cita literalmente a fonte fictícia
- [x] (A) `emitir` e `prisma-verificar-publicacao` recebem a instância por argumento, com teste; a verificação continua falhando fechada
- [x] (A) O bloco `ts` do README da raiz é conferido contra um arquivo que o `tsc` compila, e o erro esperado do exemplo é pego por `@ts-expect-error`
- [x] (A) `work` depende só de `@prisma-intent/core`, por `workspace:*`; licença MIT e `publishConfig` como nos demais
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso confirma a instância fictícia, os scripts por argumento, o mapa de códigos fora do pacote e a forma do teste do README

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Trazer `src/` sem a instância, com os comentários em nomes fictícios
- [x] Instância e fonte fictícias; testes
- [x] Scripts por argumento
- [x] Documentação
- [x] Teste do exemplo do README
- [x] Gates e varredura

## Notes
Pacote: 2026-000001

Depende da task-006: a branch parte da dela, porque o core ainda não está na `develop`.

Evidência (2026-11-16, local, commit `7f84c50` em `feat/task-007`):

- procedência no commit de entrada: `sidartaveloso/sidartaveloso`, `3d8bed2`, `packages/prisma-intent-work`;
- `src/instancias/` não existe, e `test/dependencias.test.ts` trava isso junto com a exportação única do `package.json`;
- `diff` de `src/` contra a origem: nove arquivos. Em oito (`atuacao`, `case-profissional`, `codigo-publico`, `conferencia`, `experiencia`, `instancia`, `json-ld`, `referencias`) só mudam linhas de comentário. Em `index.ts` saem as cinco linhas que reexportavam o mapa de códigos;
- busca, em `packages/work`, por 153 nomes próprios e 72 ids tirados da instância real, mais uma lista de organizações e produtos: sobra só a autoria no `package.json`. A lista fica fora do repositório. gitleaks em `packages/work` e no pre-commit: `no leaks found`;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0. Testes do `work`: 27 de 28, com o de vedação pulado por não haver `PRISMA_NOMES_VEDADOS`; com a variável, os três pacotes que têm o teste passam;
- exemplo do README: trocar uma palavra da linha do `@ts-expect-error` em `test/readme.exemplo.ts` faz `readme.test.ts` falhar; corrigir a referência do exemplo faz o `tsc` acusar `TS2578: Unused '@ts-expect-error' directive`.

### Para a leitura de Sidarta

1. **Instância fictícia** (`test/exemplo.ts`): uma pessoa, duas organizações e três cases inventados, com um exemplar de cada situação que a conferência cobre. Os três erros que motivaram a conferência estão reproduzidos nela, sem os nomes.
2. **Scripts por argumento.** `emitir <módulo> [--saida <dir>]` e `prisma-verificar-publicacao --instancia <módulo> <dir>…`. Quem consome hoje chama os dois sem informar a instância; a chamada muda na migração de cada consumidor. O pacote deixou de ter `build`.
3. **Mapa de códigos públicos fora do pacote.** `codigosPublicos`, `codigoDaInstancia` e `instanciaDoCodigo` deixam de ser exportados; `gerarCodigoPublico` fica. A tabela é da instância.
4. **Teste do README.** O bloco do README usa `/* … */` e não compila sozinho. Em vez de mudar o README aprovado, o teste exige que o bloco seja um recorte, linha a linha e na ordem, de `test/readme.exemplo.ts`, que o `tsc` compila. A alternativa é reescrever o exemplo do README para compilar inteiro.
5. **`turbo.json`** passou a declarar `PRISMA_NOMES_VEDADOS` no teste; sem isso o turbo não repassa a variável e a vedação era pulada em silêncio por `pnpm test`.
6. **Vocabulário do `work`** continua com literais do primeiro caso (`Identidade`, `AtributoProbatorio`, `Oportunidade.tipo`, `Motivacao.tipo`). Não identificam ninguém e não foram mexidos; generalizar é assunto de outro pacote.
