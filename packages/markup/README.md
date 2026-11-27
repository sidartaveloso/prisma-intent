# @prisma-intent/markup

**PRISMA Intent — marcação semântica no texto.** Lê e escreve as tags do [core](../core/README.md) como
diretivas de texto do CommonMark, conferidas contra o registro de tipos:

```text
Assina :parte[a locadora]{#locadora artigo="definido" atributo="nome"} até :termo_do_acordo[30 dias]{#prazo}.
```

O core define a forma (`Tag` com atributos, `Trecho`, `TipoDeElemento` com os atributos declarados,
`registrarTipos`) e não tem dependências. A leitura e a escrita moram aqui porque dependem das bibliotecas
do micromark, que mantêm a sintaxe, o escape e a escrita de volta. A decisão, com o trade-off e a medição,
está no pacote OpenTask 2026-000003 (task-016).

## Uso

```ts
import { registrarTipos } from "@prisma-intent/core";
import { escreverMarcacao, lerMarcacao } from "@prisma-intent/markup";

const tipos = registrarTipos({
	clausula: {
		nome: "Cláusula",
		descricao: "Outra cláusula do mesmo acordo.",
		formaDoId: "^[a-z0-9_]+$",
		declaracao: "exigida",
		atributos: {
			mostrar: {
				descricao: "Como a cláusula citada aparece.",
				valores: "enumerados",
				aceitos: ["numero", "numero_e_titulo"],
				presenca: "obrigatoria",
			},
		},
	},
});

const lido = lerMarcacao("Ver :clausula[a cláusula 4]{#c4 mostrar=numero}.", tipos);
if (lido.resultado === "lido") {
	lido.trechos;
	// ["Ver ", { tipo: "clausula", id: "c4", atributos: { mostrar: "numero" }, rotulo: "a cláusula 4" }, "."]
	escreverMarcacao(lido.trechos);
	// 'Ver :clausula[a cláusula 4]{#c4 mostrar="numero"}.'
} else {
	lido.falhas; // [{ falha: "tipo_nao_registrado", tipo, intervalo }, ...]
}
```

### `lerMarcacao(texto, catalogo)`

Devolve um `ResultadoDaLeitura`:

- `{ resultado: "lido", trechos, pedacos }`: os trechos (texto ou `{ tipo, id, atributos, rotulo }`) e os
  mesmos trechos com o `intervalo` do texto de onde vieram (linha, coluna e deslocamento do início e do fim).
  Os trechos nunca têm texto vazio nem dois textos seguidos, e o texto corrido (cada tag pelo rótulo)
  reproduz o original.
- `{ resultado: "recusado", falhas }`: todas as falhas de todas as tags, cada uma com o `intervalo`.

| Falha | Quando |
| --- | --- |
| `tipo_nao_registrado` | o catálogo não tem o tipo |
| `id_ausente` | a tag não tem `#id` (ou `id=`), ou ele é vazio |
| `atributo_nao_declarado` | o tipo não declara o atributo (`.classe` vira o atributo `class`) |
| `valor_fora_dos_aceitos` | o atributo é enumerado e o valor não está na lista |
| `atributo_obrigatorio_ausente` | falta atributo obrigatório; `exigido` diz se é sempre ou por causa de outros presentes |
| `tag_sem_fechamento` | o rótulo (`[`) ou os atributos (`{`) abriram e não fecharam |
| `tag_no_rotulo` | há uma tag dentro do rótulo de outra |

A leitura só reconhece diretivas de texto. Tudo o mais do Markdown está desligado: `*`, `#`, listas, citações,
código e quatro espaços de recuo são texto. Ficam o escape (`\:`) e a referência (`&#x20;`).

O que **não** é tag e fica como texto: `palavra:palavra` sem rótulo nem atributos, como `10:30`, `3:1` ou
`e-mail:fulano` (toda tag tem `#id`); `::nome` e `:::nome` no começo da linha. Para escrever literalmente algo
que seria lido como tag, escape os dois-pontos: `\:parte[a]{#a}`.

### `escreverMarcacao(trechos)`

Escreve a forma canônica: o id em `#id`, os outros atributos em ordem alfabética, cada valor entre aspas, e o
escape do CommonMark onde o texto livre seria lido como marcação ou perderia espaço. A linha vazia no texto
separa parágrafos. `lerMarcacao(escreverMarcacao(trechos), catalogo)` devolve os mesmos trechos, quando eles
têm a forma que a leitura produz e as tags passam no catálogo (teste com 3000 trechos aleatórios).

Recusa com `RangeError` a tag que não tem escrita como diretiva: tipo que não é nome de diretiva, id vazio,
atributo `id` ou `class`, nome que não é de atributo, e id ou valor com linha vazia.

## Desempenho

A leitura e a escrita custam de 40 a 60 vezes uma expressão regular própria, de forma linear: cerca de
0,5 ms por KB, com uma tag a cada 70 caracteres. Os números estão em
[`medicao/resultados.md`](medicao/resultados.md), e `pnpm --filter @prisma-intent/markup medir` mede de novo.

## Comandos

```bash
pnpm --filter @prisma-intent/markup typecheck
pnpm --filter @prisma-intent/markup test       # ida e volta, falhas e dependências
pnpm --filter @prisma-intent/markup medir      # --gravar atualiza medicao/resultados.md
```

## Para quem mantém

- As bibliotecas têm três defeitos contornados aqui, cada um com teste: as diretivas de folha e de bloco não
  se desligam pelo `disable` (só a de texto é registrada); o `mdast-util-to-markdown` pula o escape de `:` antes
  de nome quando escapa o caractere anterior (`_:isto`); e o micromark aceita tabulação como nome de diretiva.
- O texto livre sai da fonte, decodificado por `micromark-util-decode-string`, e não do valor da árvore: o
  CommonMark corta o recuo das linhas de continuação e transforma dois espaços no fim da linha em quebra.
- O pacote fica fora do alias `prisma-intent`, para não levar o micromark a quem só usa o core.
