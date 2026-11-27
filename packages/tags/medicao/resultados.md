# Medição da marcação

Gerado por `pnpm --filter @prisma-intent/tags medir --gravar` (`medicao/medir.ts`).
Cada amostra lê o texto com `lerMarcacao` e o escreve de volta com `escreverMarcacao`; o
texto tem uma tag a cada 70 caracteres, em média. A expressão regular é a referência: lê e
escreve só a forma simples, sem escape nem conferência contra o catálogo.

Para acompanhar a regressão, rode de novo na mesma máquina e compare a coluna da mediana.
Crescimento mais que linear com o tamanho, ou razão bem acima da registrada, pede investigação.

- Data: 2026-11-27
- Ambiente: Apple M3, Node v24.17.0, darwin

| Tamanho | Tags | Amostras | Ler e escrever (mediana) | Expressão regular (mediana) | Razão |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 KB | 15 | 301 | 0,48 ms | 0,01 ms | 40× |
| 10 KB | 144 | 101 | 4,4 ms | 0,09 ms | 48× |
| 100 KB | 1434 | 31 | 51,5 ms | 0,91 ms | 57× |
| 1 MB | 14676 | 9 | 0,56 s | 12,2 ms | 46× |
