# 🧩 Task 009 — A falha da vedação de nomes não imprime a lista

- Status: done
- Type: fix
- Assignee: sidartaveloso

## Description
Os testes de vedação de `sales`, `funding`, `work` e `educate` (tasks 006 a 008) recebem a lista de nomes reais pela variável `PRISMA_NOMES_VEDADOS`, para que ela não more no repositório. Mas, quando um deles reprova, a saída do Node traz a expressão regular inteira e o conteúdo do arquivo que casou — e, quando a expressão é inválida, a mensagem de erro também a traz. Num log público, isso expõe a lista que a variável existe para esconder.

A falha passa a dizer só o arquivo e a linha.

## Acceptance criteria
- [x] (A) Com um padrão que casa, a saída do teste traz arquivo e linha, e não traz o padrão nem o conteúdo do arquivo
- [x] (A) Com uma expressão inválida, o teste reprova sem imprimir a expressão
- [x] (A) Sem a variável o teste continua pulado; com um padrão que não casa, passa
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Trocar a asserção nos quatro testes
- [x] Exercitar os quatro casos

## Notes
Pacote: 2026-000001

Evidência (2026-11-16, local, em `fix/task-009`), com a expressão de teste `"license": "MIT"|nunca-aparece-no-log`:

- padrão que casa: os quatro pacotes reprovam com `package.json:6 cita um nome vedado`; `nunca-aparece-no-log` e o conteúdo do `package.json` aparecem zero vezes na saída;
- expressão inválida (`(nunca-aparece-no-log`): os quatro reprovam com `PRISMA_NOMES_VEDADOS não é uma expressão regular válida`; a expressão aparece zero vezes;
- sem a variável: os quatro testes pulados, com o motivo; com um padrão que não casa, os quatro passam; com a lista de nomes reais, mantida fora do repositório, os quatro passam;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0.

Fica como estava: o CI não define a variável, então lá o teste é pulado. Definir a lista como segredo do CI é decisão de Sidarta.
