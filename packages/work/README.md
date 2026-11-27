# @prisma-intent/work

Especialização do PRISMA Intent para **posicionamento profissional**: currículo,
portfólio, site pessoal, LinkedIn, candidatura, entrevista e contratação para
consultoria.

Depende de [`@prisma-intent/core`](../core) e nunca o contrário.

## A inversão

Um currículo não é composto de projetos. É composto de **argumentos sobre
alguém**, sustentados por projetos. Por isso a seleção começa pelo argumento que
se precisa provar, e só então busca a melhor evidência disponível.

```text
fatos + experiências → ARGUMENTOS que podemos provar → cases como evidência
                                    ↓
              nossa intenção × intenção do consumidor × canal
                                    ↓
                    texto · visual · dados semânticos
```

## Instância

Uma instância é a base única de que saem todas as renderizações. Declará-la com
`definirInstancia` faz o compilador conferir as referências cruzadas:

```ts
export const instancia = definirInstancia({
  cases: [{ id: "painel-de-frotas", /* … */ }],
  argumentos: [
    {
      id: "arquitetura-e-execucao",
      evidencias: [{ tipo: "case", case: "painel-de-frota" }],
      //                    erro: "painel-de-frota" não existe ^
    },
  ],
});
```

Os ids são inferidos de `cases[].id` e `argumentos[].id`; o `NoInfer` nas
posições de referência é o que impede um id errado de ser absorvido pela
inferência em vez de recusado.

Este pacote não guarda instância nenhuma: ela é de quem a declara, e mora no
repositório dessa pessoa. Para ver uma inteira, há duas fictícias nos testes:
[`test/exemplo.ts`](test/exemplo.ts), com um exemplar de cada situação, e
[`test/readme.exemplo.ts`](test/readme.exemplo.ts), a menor que compila.

> **Antes de mexer em qualquer coisa aqui, leia o [AGENTS.md](AGENTS.md).** Ele
> tem a fronteira entre fato e voz de canal, a regra de que nenhum módulo
> empacotado pode importar a instância, a diferença entre as duas verificações, e
> as receitas de extensão.

## Renderizações

Um canal não é um formato: é um leitor com uma pergunta. `curriculo_online`
existe separado de `site_pessoal` porque quem escaneou o código do currículo
impresso não pergunta "quem é essa pessoa?", e sim "o que mais existe além do que
coube nas folhas?" — o que muda o que a página mostra primeiro.

Cada `renderizacao` declara objetivo, profundidade, o conteúdo prioritário na
ordem em que deve entrar, as regras editoriais do formato e, quando o canal
publica em mais de uma língua, os idiomas.

Duas distinções que economizam tempo:

- **`idiomas` não é `idiomaBase`.** O segundo é a língua em que os fatos foram
  escritos e não muda; o primeiro é propriedade do canal. A política de segurança
  publica em português e inglês sobre a mesma base.
- **`objetivo` e `regras` são instrução, não conteúdo.** São escritos para quem
  monta a saída, como a `conclusao.tese` — e, como ela, nunca devem chegar ao
  leitor.

Nem todo campo é lido por código, e nem todo canal declarado tem renderizador. O
[AGENTS.md](AGENTS.md) diz exatamente qual é qual.

Declarar um canal é a metade barata; **operar** o canal depois de publicado é a
outra. Cada canal que exige algo de quem publica tem um manual em
[`docs/canais/`](docs/canais/) — o primeiro é o de
[`politica_de_seguranca`](docs/canais/politica-de-seguranca.md). E o que é da
pessoa, e não de canal nenhum, fica em `docs/`: a
[chave PGP](docs/chave-pgp.md), que uma renderização publica e outras quatro
usam.

## Autoria é dado, não adjetivo

`Autoria` distingue idealização, autoria direta, liderança, responsabilidade de
terceiro e tecnologia incorporada. É o que impede o material de dizer
"desenvolvi" onde o correto é "liderei", e o que faz o JSON-LD emitir `creator`
num caso e `contributor` no outro — ou nada, quando o componente é de terceiro.

O módulo `redacao.ts` traduz isso em texto uma vez só, para que currículo e site
não cheguem a duas formulações diferentes do mesmo fato.

## Regras de integridade

Não são anotações editoriais: delimitam o que nenhuma renderização pode
afirmar. `descreverResultados` usa a `redacaoSegura` da métrica justamente para
que a formulação verificada seja dado, e não decisão de quem escreve a saída.

## Comandos

Os dois recebem o módulo que exporta a instância:

```bash
tsx scripts/emitir.ts <módulo-da-instância> [--saida <diretório>]
prisma-verificar-publicacao --instancia <módulo-da-instância> <diretório> [...]
```

`emitir` gera, a partir do TypeScript:

- `<saída>/<instancia>.json` — a instância inteira, para consumo por
  ferramentas; traz estratégia, objeções e reservas, e não é material de
  publicação;
- `<saída>/<instancia>.jsonld` — recorte semântico para agentes e buscadores.

`prisma-verificar-publicacao` confere um diretório já construído contra o que a
instância reserva, e falha fechado.
