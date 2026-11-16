# 🧩 Task 009 — A falha da vedação de nomes não imprime a lista

- Status: pending
- Type: fix
- Assignee: sidartaveloso

## Description
Os testes de vedação de `sales`, `funding`, `work` e `educate` (tasks 006 a 008) recebem a lista de nomes reais pela variável `PRISMA_NOMES_VEDADOS`, para que ela não more no repositório. Mas, quando um deles reprova, a saída do Node traz a expressão regular inteira e o conteúdo do arquivo que casou — e, quando a expressão é inválida, a mensagem de erro também a traz. Num log público, isso expõe a lista que a variável existe para esconder.

A falha passa a dizer só o arquivo e a linha.

## Acceptance criteria
- [ ] (A) Com um padrão que casa, a saída do teste traz arquivo e linha, e não traz o padrão nem o conteúdo do arquivo
- [ ] (A) Com uma expressão inválida, o teste reprova sem imprimir a expressão
- [ ] (A) Sem a variável o teste continua pulado; com um padrão que não casa, passa
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Trocar a asserção nos quatro testes
- [ ] Exercitar os quatro casos

## Notes
Pacote: 2026-000001
