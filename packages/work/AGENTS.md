# AGENTS.md — @prisma-intent/work

Manual operacional. A tese está no [README](README.md); aqui está o que já custou
tempo a alguém descobrir.

## 1. A fronteira que mais dá errado: fato × voz

**Todo fato sobre o profissional** vive num lugar só: a instância, no
repositório de quem a declara. Este pacote não guarda instância nenhuma; as dos
testes (`test/exemplo.ts`, `test/readme.exemplo.ts`) são fictícias.

**A voz de cada canal — perguntas, dores do leitor, chamadas, títulos de seção,
contato, política — não.** Vive no `editorial.ts` (ou equivalente) do app que
publica.

O teste prático: **a frase pode ser desmentida por um documento?**

- "Mais de 2.000 veículos monitorados" → sim. É fato, vai na instância.
- "Qual problema você está tentando resolver?" → não. É voz, fica no canal.
- "Não realize ataques de indisponibilidade" → não. É política de canal.
- "security@dominio" → contato muda conforme onde o material é entregue. É do
  canal.

Um site que mantém os dois juntos publica números que a instância não sustenta,
e nada acusa a divergência.

**Cuidado com o inverso:** `conclusao.tese` e `renderizacoes[].regras` parecem
conteúdo e são **instrução de estratégia**, escrita para quem monta o material.
Nunca podem chegar ao leitor.

## 2. `renderizacoes[]` — o que é lido e o que é declarativo

Este pacote não lê nenhum dos sete campos: quem lê é o renderizador de cada
canal, no app que publica. Na prática, três costumam ser lidos por código e
quatro existem para quem escreve a renderização — humano ou agente.

| Campo | Para quê |
| --- | --- |
| `conteudoPrioritario` | ordem e corte do que o canal mostra |
| `limitePaginas` | conferido na geração; costuma **avisar, não falhar** |
| `idiomas` | quais páginas emitir |
| `objetivo`, `prioridade`, `profundidade`, `regras` | instrução para quem escreve; código nenhum precisa ler |

Corolários que não são bugs:

- Um canal pode estar declarado sem que código nenhum o leia, e o vocabulário
  pode conter um canal antes de existir saída para ele (`proposta` é um `Canal`).
- `conteudoPrioritario` é tipado a ids de case. Canal sem case usa `[]` — e o
  vazio é uma declaração ("este canal não prioriza case nenhum"), não um
  esquecimento. Declare o motivo em comentário.
- `idiomas` ausente significa "publica em `idiomaBase`". Não confunda os dois:
  `idiomaBase` é a língua em que os **fatos** foram escritos; `idiomas` é
  propriedade do **canal**.

Um renderizador que **exige** a declaração — liga cada página a um canal e
falha se o canal não existir na instância — é o que separa "esta página é uma
renderização do PRISMA" de retórica.

## 3. As duas verificações — não são a mesma coisa

|  | `verificarRegras` (core) | `prisma-verificar-publicacao` (bin daqui) |
| --- | --- | --- |
| Sobre o quê | uma string de prosa | todo arquivo de um diretório construído |
| Como | regex de `padroesVedados` | `includes()` de `termosNaoPublicaveis` |
| Cobertura | só `restricao_de_divulgacao` e `restricao_de_competencia` | id da instância, ids e hipóteses de objeção, texto das regras, organizações reservadas, restrições editoriais de case, motivos de exclusão — filtrados por `termo.length >= 8` |
| Quando | `scripts/emitir.ts` e a geração de cada canal | último passo do build de quem publica |
| Pega o quê | uma frase proibida que alguém escreveu | a instância inteira vazando pelo bundler |
| Falha | `exit(1)` | `exit(1)`, **inclusive sem instância, sem diretório ou com o diretório vazio** |

Os dois scripts recebem o módulo da instância por argumento (`scripts/carregar-instancia.ts`
acha nele a exportação que é uma instância Work):

```bash
tsx scripts/emitir.ts <módulo-da-instância> [--saida <diretório>]
prisma-verificar-publicacao --instancia <módulo-da-instância> <diretório> [...]
```

A verificação de publicação é sobre o **artefato**, não sobre o código: o
vazamento que a motivou nasceu do bundler, e nenhuma revisão de código pegaria —
o fonte importava um módulo, o que é normal. O próprio script imprime a pista:

> Provável causa: algum módulo do app importa a instância e o bundler a incluiu
> inteira. O conteúdo precisa ser pré-computado antes do build.

O filtro `length >= 8` existe para que termos curtos não casem por acaso dentro
de um bundle minificado. Se você adicionar uma regra cujo texto seja curto, ela
não entra na lista.

## 3b. Conferência — a terceira leitura, que não reprova

As duas verificações acima respondem sim ou não sobre o que **não pode** ser
dito. `lacunas[]` registra o que **não se sabe**. Nenhuma das três lê de volta
o que **está sendo afirmado** — e é nesse vão que nascem erros como um
reconhecimento que perde o sujeito ao mudar de título, uma liderança pendurada
na organização errada e um piso que afirma mais do que a fonte sustenta. Nenhum
é violação de regra; nenhum é lacuna.

`src/conferencia.ts` entrega o que depende da instância: `coletarAfirmacoes`
lista cada fato publicável com o valor declarado, as **marcas** pelas quais ele
é reconhecível no texto publicado, a procedência e conselhos de formulação.

Pôr isso lado a lado com a frase que cada canal publica, e com **o título sob
o qual ela sai**, é trabalho de quem enxerga os canais — este pacote não os
conhece, e redigir de novo as frases para conferi-las seria pior: duas
derivações divergem, e a conferência passaria a atestar um texto que ninguém
publica. O título é a razão de a conferência existir: um fato correto sob um
cabeçalho que o reatribui só aparece na leitura do par.

Duas coisas que a conferência deliberadamente **não** faz:

- **Não reprova.** Quem reprova é `verificarRegras`. Uma conferência que falha
  o build vira ruído que se aprende a ignorar.
- **Não reescreve.** Os conselhos sugerem formulação e nunca a aplicam.
  `Quantidade` existe para que a pessoa declare a precisão da afirmação; um
  arredondador automático devolve ao renderizador a escolha do advérbio, agora
  com a assinatura da ferramenta em cima — o que é pior, porque parece
  conferido. E "melhor" não é computável fora de uma faixa estreita: 19 → "mais
  de 15" funciona, 200 → "mais de 150" é ridículo.

## 3c. Procedência — de onde o número veio

`nivel` diz **como** algo é sabido; `procedencia` diz **de onde**. Sem o
segundo, `minima: 20` e `aproximada: 20` são indistinguíveis para qualquer
verificação — e é assim que "mais de 20 programadores" fica publicado sobre uma
fonte que diz "20", "aproximadamente 20" e "até 20".

Todo número publicável (`metrica`, `metrica_minima`, `lideranca.quantidade`)
precisa de uma das duas coisas:

1. `procedencia`, com o arquivo da fonte arquivada, a linha e a **citação
   literal**. `test/procedencia.test.ts` abre o arquivo e procura o trecho:
   paráfrase não passa, porque conferir a instância contra ela mesma dá
   sensação de auditoria sem auditar nada. Quem tem uma instância roda o mesmo
   teste sobre ela.
2. uma entrada em `lacunas[]` com id `fonte_de_<assunto>`, quando a fonte ainda
   não foi rastreada. Ninguém ter conferido é um estado legítimo do modelo;
   ninguém ter conferido **em silêncio** não é.

`ressalva` é o campo para quando o número publicado se afasta da fonte de
propósito.

## 4. A regra de pré-computação

**Nenhum módulo que o bundler empacota pode importar a instância.**

Um site que faz isso publica, no JavaScript, o objeto inteiro: objeções, regras
de integridade, estratégia editorial, lacunas — e as experiências reservadas,
que não deveriam aparecer em lugar nenhum. As reservas funcionam no texto
renderizado; o dado segue no bundle, a um DevTools de distância.

Dois modelos de consumo, ambos válidos, cada um pelo seu motivo:

```
site      →  instância → script Node → conteúdo gerado → acessador tipado → componente
currículo →  instância → SSR em Node → HTML → PDF     (a instância nunca vai ao browser)
```

O site pré-computa porque publica JavaScript; o currículo não precisa porque
renderiza no Node e publica só o resultado.

A mesma lógica vale um nível acima da instância: o raciocínio editorial de cada
bloco de página também fica em Node. O navegador recebe a ordem dos blocos, não
o porquê de cada um.

## 5. Armadilhas conhecidas

- **`padroesVedados` é escrito numa língua.** Uma regra que veda carga horária
  com `\bhoras?\b` não pega `hours` nem `part-time`. Saída em idioma novo exige
  padrão novo, ou passa sem verificação e ninguém percebe.
- **`idiomaBase` é tipo literal `"pt-BR"`**, e é da instância, não do canal.
- **Não remova o `NoInfer`** das posições de referência em `definirInstancia`. É
  ele que faz um id errado ser recusado em vez de absorvido pela inferência —
  sem ele, um id com uma letra a menos viraria um id válido novo.
- **A chave PGP é fato da pessoa, não voz de canal.** "Contato é do canal" vale
  para o *endereço* `security@`, que é roteamento; não vale para a chave, que é
  identidade única usada por site, `security.txt`, commits e currículo. `Pessoa`
  ainda não tem campo para ela; o manual está em
  [`docs/chave-pgp.md`](docs/chave-pgp.md).
- **O mapa de códigos públicos é da instância, e nunca pode ser publicado** nem
  importado por app. `gerarCodigoPublico` mora aqui; a tabela que liga cada
  código à instância que ele representa mora com a instância. Quem tiver o mapa
  deduz, a partir de um currículo impresso, para quais empresas os outros foram
  enviados.
- **O JSON de `emitir` traz a instância inteira.** Serve a ferramentas, não a
  app nenhum, e não é material de publicação.
- **Uma competência tirada continua podendo ser tecnologia de um case.** A
  linguagem sai de `baseTecnica` e permanece em `cases[].tecnologias`: o app foi
  escrito nela; o que não se afirma é domínio da linguagem. Vale um teste na
  instância travando a diferença contra uma "limpeza" futura.
- **O vocabulário ainda carrega literais do primeiro caso.** `Identidade`,
  `AtributoProbatorio`, `Oportunidade.tipo` e `Motivacao.tipo` têm valores que
  só fazem sentido para uma trajetória. Um caso novo que não caiba pede termo
  novo aqui, não um termo emprestado.

## 6. Receitas

### Adicionar um case

1. `cases[]` na instância: `id`, `contexto`, `problema`, `frentes[]` com
   `autoria`, `resultados`, `tecnologias`.
2. Toda frente declara `autoria`. Componente de terceiro é
   `tecnologia_incorporada` ou `de_terceiro` — não invente autoria direta.
3. Métrica sensível ganha `redacaoSegura`: é a formulação já conferida, e
   `descreverResultados` usa ela para que a redação seja dado, não decisão de
   quem escreve a saída.
4. Acrescente o id ao `conteudoPrioritario` dos canais em que ele deve aparecer.

### Adicionar uma regra de integridade verificável

1. `regrasDeIntegridade[]` com `natureza: "restricao_de_divulgacao"` ou
   `"restricao_de_competencia"` — as outras cinco não são verificáveis.
2. `padroesVedados` com regex **em todos os idiomas que algum canal publica**.
3. Confira que a saída atual passa, nos testes do app que publica.

### Tirar uma competência

Remova das listas de `baseTecnica` **e** declare a regra com `padroesVedados` —
senão ela volta pela próxima renderização e nada acusa.

### Adicionar um canal de renderização

Exemplo trabalhado: `politica_de_seguranca`, o canal da política de divulgação de
vulnerabilidades.

1. **`src/vocabulario.ts`** — acrescente o literal a `Canal`, com um comentário
   dizendo *por que é canal próprio*: qual pergunta o leitor traz, e o que isso
   muda no que a saída mostra primeiro. Se o público não existe, acrescente o
   termo a `perfisHumanos` (`pesquisador_de_seguranca`) ou a `perfisAgente`
   (`leitor_de_security_txt`).
2. **Se o canal publica em mais de um idioma** — o vocabulário precisa dizer
   quais são (`IdiomaDePublicacao`), e `instancia.ts` precisa amarrar o genérico:
   `Renderizacao<Canal, NoInfer<TCase>, IdiomaDePublicacao>`. O campo `idiomas`
   entrou no core como genérico com `default`, o que é a forma de estender lá sem
   quebrar quem já instancia — veja o [AGENTS.md do core](../core/AGENTS.md).
3. **A instância** — nova entrada em `renderizacoes[]`. `objetivo` e `regras` são
   para quem escreve a saída, não para o leitor. `conteudoPrioritario: []` se o
   canal não prioriza case, com o motivo em comentário.
4. **Regras de integridade** — se o canal publica em idioma novo, amplie os
   `padroesVedados` das regras existentes. Sem isso, a saída nova sai fora do
   alcance da verificação, e "nenhuma violação" passa a significar "não entendi o
   texto".
5. **Os blocos e a intenção** — no app que publica, cada bloco de página declara
   o que existe para provocar (persuasivo) ou para permitir (funcional), o
   elemento semântico e a informação que carrega. Bloco funcional não sustenta
   argumento sobre o profissional. A intenção desce até o átomo: dois botões de
   copiar são o mesmo componente em dois blocos, porque as intenções diferem.
6. **O vínculo da página ao canal** — a geração falha se o canal não existir na
   instância. Um canal declarado que ninguém lê é documentação; um canal que
   quebra o build é contrato.
7. **A voz** — a prosa vai no conteúdo do app, num arquivo por idioma, todos
   satisfazendo o mesmo tipo, para que o compilador cuide da paridade.
8. **Pré-computação** — o que o canal precisa da instância entra no conteúdo
   gerado, e a geração roda `verificarRegras` sobre a prosa antes de ela virar
   HTML. `objetivo` e `regras` **não** entram.
9. **O manual do canal** — `docs/canais/<canal>.md`: para quem, o que a
   instância declara, o que a renderização entrega e os **deveres operacionais**
   depois de publicado. Público: quem adota o PRISMA, não quem edita este código
   — por isso não fica aqui. Exemplo:
   [`docs/canais/politica-de-seguranca.md`](docs/canais/politica-de-seguranca.md).
10. **As entradas do build** — derive-as dos `idiomas` do canal, não de uma lista
    escrita à mão. Ler a instância na configuração do build é seguro: ela roda
    em Node e não é empacotada. Declarar um idioma a mais passa a ser mudança de
    instância, e o build quebra até existir o par conteúdo + casca HTML — que é
    o único jeito de não publicar meia tradução.

## 6b. Três camadas de documentação

| Camada | Público | Onde |
| --- | --- | --- |
| `README.md` | quem quer entender a tese | raiz do pacote |
| `AGENTS.md` | quem edita o código (agente ou pessoa) | raiz do pacote |
| `docs/` | quem **adota** o PRISMA e opera o que declarou | `docs/canais/<canal>.md`, `docs/chave-pgp.md` |

Custódia de chave ao lado de `NoInfer` confundiria quem lê qualquer dos dois —
por isso a terceira camada existe.

## 7. Mapa de arquivo → conceito

**Entidades:** `pessoa.ts` · `oportunidade.ts` · `experiencia.ts` ·
`case-profissional.ts` · `formacao.ts` · `base-tecnica.ts` · `estrategia.ts` ·
`referencias.ts`

**Vocabulário:** `vocabulario.ts` (`Canal`, `IdiomaDePublicacao`,
`perfisHumanos`, `perfisAgente`, `qualidades`, `Sentimento`, `Unidade`, …)

**Agregado:** `instancia.ts` (`definirInstancia`, `InstanciaWork`)

**Redação derivada:** `redacao.ts` (autoria vira verbo uma vez só, para que
currículo e site não cheguem a duas formulações do mesmo fato) · `atuacao.ts`

**Projeções:** `json-ld.ts` (`montarJsonLd`, `montarProfilePage`)

**Leitura de volta:** `conferencia.ts` (`coletarAfirmacoes`,
`coletarProcedencias`, `afirmacoesSemProcedencia`, `aconselhar`)

**Guardas:** `publicacao.ts` (`termosNaoPublicaveis`) · `codigo-publico.ts`
(`gerarCodigoPublico`)

**Scripts:** `scripts/emitir.ts` · `scripts/verificar-publicacao.ts` ·
`scripts/carregar-instancia.ts`
