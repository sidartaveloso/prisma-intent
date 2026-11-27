# AGENTS.md — @prisma-intent/funding

Manual operacional. A tese está no [README](README.md); aqui está o que decide onde cada coisa vai e o que já se sabe que dá errado.

## 1. Três camadas

| Camada | O que é | Onde |
| --- | --- | --- |
| Core | Gramática universal, incluindo `Premissa`, `DecisaoRegistrada`, `Interno`/`ConteudoRenderizavel` e `ObservacaoDosEfeitos` | `../core` |
| **Funding (este pacote)** | Vocabulário e tipos de qualquer campanha de financiamento de produto — perfis, intenções, efeitos, critérios, canais, recurso com natureza, evidência de produto, campanha, dossiê de etapa, regras do domínio — e as conferências | aqui |
| Instância | Uma campanha concreta: o produto, os recursos, o que se afirma, a estratégia, os dossiês | quem usa — em outro repositório |

Teste para saber onde algo vai: **a frase é verdadeira para qualquer campanha de financiamento de produto, ou só para esta?** "Renderização de conceito não prova o produto" é do domínio. "Nenhuma saída traz o IMEI do aparelho reaproveitado" é da instância (só vale para quem reaproveita aparelhos) e entra nas `regrasDaCasa`. "O consumidor tem intenções prováveis" é core.

Se um tipo novo precisa citar um produto ou uma empresa pelo nome, ele não é deste pacote. `test/dependencias.test.ts` confere que a única dependência é o core e, quando a variável `PRISMA_NOMES_VEDADOS` traz uma expressão regular, que nenhum arquivo do pacote casa com ela. A lista de nomes não mora aqui: num repositório aberto, ela seria o vazamento.

## 2. Fato × voz × estratégia

A fronteira da Work vale aqui ([`../work/AGENTS.md`](../work/AGENTS.md), §1):

- **Fato do produto** vive na instância: argumentos, evidências, recursos.
- **Voz do canal** (títulos, a frase que diz que não há protótipo) vive no renderizador.
- **Instrução de estratégia** — `diretriz` da objeção, `conclusaoDesejada`, `objetivo` e `regras` das renderizações, `como` de uma observação por registro de pessoa — nunca chega ao leitor. O leitor lê `respostasAoLeitor`.

`Redacao` é `string`, e nada no tipo impede uma diretriz de cair numa página. Monte a projeção pública como `ConteudoRenderizavel`, passe por `garantirRenderizavel`, e procure cada instrução de estratégia no texto público num teste da instância.

## 3. O que este domínio pediu ao core e como foi resolvido

| Pressão | Resolução | Onde |
| --- | --- | --- |
| Apoiar não é comprar | efeito `distingue_financiamento_de_compra`; regra `financiamento_nao_e_compra` com padrões vedados | `vocabulario.ts`, `regras.ts` |
| Renderização de conceito não prova produto | `Recurso.natureza`; `verificarCampanha` recusa demonstração sobre conceito e bloqueia conceito carregando intenção pública | `recurso.ts`, `verificar.ts` |
| Promessa sem prova não vai a público | argumento do core sem evidência = promessa a provar; bloqueio se estiver em canal público | `verificar.ts` |
| Cada parte da peça a serviço de uma intenção, sem intenção por recurso | `Vinculo` com papel `carrega`/`apoia`, declarado do lado da intenção | `recurso.ts`, `intencao.ts` |
| Cada etapa interna é uma decisão com consumidor próprio | `Dossie`: decisor interno, perguntas como argumentos do core, lacunas, `DecisaoRegistrada` | `dossie.ts` |
| Efeito comportamental precisa de forma verificável | `ObservacaoDosEfeitos` do core com a observação da Funding (plataforma, site, registro de pessoa); meta como `Premissa` | `intencao.ts` |
| Diretriz é estratégia, não resposta | `respostasAoLeitor` com `Certeza<Redacao>` por objeção | `campanha.ts` |

`Premissa`, `Interno`/`ConteudoRenderizavel` e `ObservacaoDosEfeitos` nasceram na Sales, foram espelhados aqui enquanto a Funding estava incubada, e subiram para o core. Nada mais mudou o core.

## 4. `padroesVedados` está em português

As regras do domínio com padrão (`financiamento_nao_e_compra`, `escassez_verdadeira`, `impacto_sem_exagero`) são expressões em português. Campanha publicada em inglês — comum em plataformas internacionais — não é coberta por `verificarRegras` até que a regra ganhe padrões em inglês; `verificarCampanha` emite aviso quando `idiomas` inclui `en`. Passar sem verificação é pior do que falhar (mesma armadilha do core, da Work e da Sales).

## 5. Armadilhas conhecidas

- **Não remova o `NoInfer`** das posições de referência em `Campanha` e `Dossie`. Sem ele, um id errado amplia a união em vez de ser recusado.
- **`ObservacaoDosEfeitos` fica opcional no tipo genérico.** Com os efeitos conhecidos, cada um é obrigatório; com `Campanha` sem parâmetros, as chaves são opcionais — por isso `verificarCampanha` repete a conferência em execução.
- **`ArgumentoDe` e `RecursoDe` inferem contra o universo de efeitos** (`EfeitoComportamental`), não contra `never`: uma campanha concreta não cabe em `Campanha<…, never>`.
- **Bloqueio não é erro.** Uma campanha em `conceito` cheia de bloqueios está correta; o erro é marcá-la `pronta_para_publicar` com bloqueio.
- **`Recurso` e `Vinculo` antecipam o recurso com intenção** (task-004 deste repositório). Quando ele entrar no core, a Funding passa a usar o do core.

## 6. Mapa de arquivo → conceito

**Vocabulário:** `vocabulario.ts` (`perfisHumanos`, `perfisAgente`, `intencoesDoConsumidor`, efeitos, `criteriosDeDecisao`, `Canal`, `canaisInternos`, `Unidade`, `IdiomaDePublicacao`, `Plataforma`)

**Peça:** `recurso.ts` (`Recurso`, `Vinculo`, `Linguagem`, `NaturezaDoRecurso`) · `evidencia.ts` (`EvidenciaFunding`)

**Leitura:** `publico.ts` (`ConsumidorFunding`) · `intencao.ts` (`NossaIntencaoFunding`, `ObservacaoDoEfeito`, `ObservacaoDosEfeitos`, `MetaDoEfeito`)

**Agregados:** `campanha.ts` (`Campanha`, `definirCampanha`, `ArgumentoDe`, `RecursoDe`) · `dossie.ts` (`Dossie`, `definirDossie`, `DecisaoDaEtapa`)

**Regras e conferência:** `regras.ts` (`regrasDoDominio`) · `verificar.ts` (`verificarCampanha`, `verificarDossie`, `verificarTexto`, `coberturaDeEvidencia`)

**Testes:** `test/exemplo.ts` é a campanha fictícia; `test/tipos.test.ts` tem os `@ts-expect-error` conferidos pelo `typecheck`.
