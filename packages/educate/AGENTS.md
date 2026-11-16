# AGENTS.md — @prisma-intent/educate

Manual operacional. A tese está no [README](README.md); aqui está o que decide onde cada coisa vai.

## 1. Quatro camadas

| Camada | O que é | Onde |
| --- | --- | --- |
| Core | Gramática universal: consumidor, intenção, contexto, renderização, regra de integridade | `../core` |
| **Educate (este pacote)** | Vocabulário e tipos de educar alguém, em qualquer idade: quem aprende, quem decide e quem acompanha; efeitos; objetivo observável; tema; missão; máquinas de estado; regras do domínio; brief | aqui |
| Vocabulário da instância | O que é de um produto: canais, linhas, faixas, necessidades, estágios, efeitos próprios, idiomas | quem usa, declarado com `definirVocabulario` e entregue a `definirBrief` |
| Instância | Os briefs e as histórias de um produto concreto | quem usa — em outro repositório |

Teste para saber onde algo vai: **a frase é verdadeira para qualquer plataforma que eduque, ou só para uma?** "Quem aprende nem sempre é quem decide" é do domínio. "Abaixo de certa idade só para ver juntos" é decisão de um produto: vai no vocabulário e nas regras da instância. "O personagem se chama X" é instância. "O consumidor tem intenções prováveis" é core.

Se um tipo novo precisa citar um produto, uma idade ou um canal pelo nome, ele não é deste pacote.

## 2. O que não mora aqui, e por quê

| Não mora aqui | Onde fica | Por quê |
| --- | --- | --- |
| Faixas etárias | `VocabularioDaInstancia["faixa"]` | cada produto recorta as idades a seu modo — e há produto sem faixa nenhuma |
| Canais | `VocabularioDaInstancia["canal"]` | canal é situação de consumo, e as situações são de cada produto |
| Linhas de conteúdo | `VocabularioDaInstancia["linha"]` | são as séries de um produto |
| Necessidades e estágios | `VocabularioDaInstancia["necessidade"]`, `["estagio"]` | dependem do público que o produto atende |
| Efeitos comportamentais próprios | somados à base em `VocabularioDaInstancia["efeitoComportamental"]` | a base daqui é comum; o que um produto quer provocar além dela é dele |
| Regra que vale para um canal ou uma faixa | `Brief.regrasDaCasa` | o pacote não conhece canal nem faixa |
| Casa, família, conta; ciclo de vida da relação com o produto | a instância | descrevem como um produto se organiza, não o que é educar |

## 3. O que este domínio pediu ao core e como foi resolvido

| Pressão | Resolução | Onde |
| --- | --- | --- |
| O consumidor principal pode não decidir | `QuemDecide` no perfil; `perfisHumanos` separa `aprendiz` de `decisor` | `publico.ts` |
| Uma história não argumenta com quem aprende | `ConsumidorEducate<never>` no brief: sem `argumentosPrioritarios`; a persuasão é do canal de quem decide, se houver | `brief.ts` |
| Efeito comportamental precisa de forma verificável | `ObjetivoObservavel` (Mager) ao lado do efeito literal | `objetivo.ts` |
| Tema não existe no core | `Tema` com `OrigemDoTema` discriminada | `tema.ts` |
| O vocabulário do produto não pode entrar no pacote | `VocabularioDaInstancia`, entregue como tipo a `definirBrief` | `brief.ts` |

Nada disso mudou o core. Se algum dia precisar, a forma é genérico novo com `default` (ver `AGENTS.md` do core).

**`objetivo.ts` só depende do core, e deve continuar assim.** `ObjetivoObservavel` não tem nada de educação em particular. Quando uma segunda especialização precisar dizer como um efeito comportamental é observado, ele sobe para o core — é o critério de lá: dois domínios precisando do mesmo conceito, sem nenhum termo de domínio nele. `test/dependencias.test.ts` trava a dependência.

## 4. `verificarRegras` — o que confere aqui

Só `sem_telemetria_na_saida`, `moral_nao_declarada` e `sem_perfilamento_nem_publicidade` têm `padroesVedados`; as outras quatro regras do domínio são editoriais. Os padrões estão **em português**: saída em outro idioma não é coberta (a mesma armadilha registrada no `work`).

Rode `verificarRegras(texto, [...regrasDoDominio, ...brief.regrasDaCasa])` sobre a prosa de **cada renderização** antes de publicar — a mensagem a quem decide inclusive. `sem_telemetria_na_saida` fala do que vai para **terceiros** (quem decide, quem acompanha, a instituição): o que o aprendiz vê sobre o próprio estudo é outra renderização, com as regras que a instância lhe der. O teste `regras.test.ts` mostra o que passa e o que não passa.

## 5. Receitas

### Adicionar um efeito à base

1. `vocabulario.ts`, no `definirVocabulario` da natureza certa, com `nome` e `descricao` que digam o que ele **é**, não quando usá-lo.
2. Comportamental: o nome tem de ser verbo observável — `verboNaoObservavel` acusa "compreender", "sentir", "pensar", "refletir" e "valorizar", e `regras.test.ts` roda sobre a base inteira.
3. Emocional: cite a âncora (Krathwohl ou a competência do referencial) na descrição.
4. Só entra na base o que vale em qualquer idade e em mais de um produto. O resto é efeito da instância.

### Somar um efeito na instância

1. Declare com `definirVocabulario`, no repositório da instância.
2. Una à base no vocabulário: `efeitoComportamental: EfeitoComportamental | keyof typeof meusEfeitos`.
3. Rode `verboNaoObservavel` sobre os nomes num teste da instância: a exigência de Mager é a mesma.

### Declarar um canal

Canal é da instância: `definirVocabulario`, com a descrição dizendo **por que é situação própria** (qual pergunta quem consome traz). Se o canal tem regra de renderização própria, ela vai em `Brief.regrasDaCasa`. A renderização em si é `Brief.renderizacoes`.

### Adicionar um estado a uma máquina

1. Acrescente o literal e a linha na tabela `transicoes…` correspondente em `estados.ts`.
2. `estados.test.ts` exige que todo estado seja alcançável a partir do inicial e que terminais não tenham saída; rode-o.
3. Máquina que descreve como um produto se organiza não é daqui.

### Adicionar uma regra do domínio

1. `regras.ts`: id em `IdDaRegraDoDominio`, com a fonte pública ao lado quando houver.
2. Se for verificável por texto, `natureza: "restricao_de_divulgacao"` com `padroesVedados` e um teste em `regras.test.ts` com um texto que viola e um que passa.
3. Regra da casa (esta família, esta turma ou este aprendiz não quer X) não é daqui: `Brief.regrasDaCasa`.

## 6. Mapa de arquivo → conceito

**Vocabulário:** `vocabulario.ts` (`perfisHumanos`, `perfisAgente`, `IntencaoDoConsumidor`, `efeitosCognitivos`, `efeitosEmocionais`, `efeitosComportamentais`, `Sentimento`, `Unidade`)

**Entidades:** `publico.ts` (`PerfilDeAprendiz`, `QuemDecide`, `EstagioDeDesenvolvimento`, `ConsumidorEducate`) · `intencao.ts` (`NossaIntencaoEducate`, `TipoDeIntencao`) · `objetivo.ts` (`ObjetivoObservavel`, `verboNaoObservavel`) · `tema.ts` (`Tema`, `OrigemDoTema`, `Alinhamento`, `MundoFiccional`) · `missao.ts` (`MissaoDoAprendiz`, `MissaoDeQuemAcompanha`, `ObjetoDoAmbiente`)

**Máquinas:** `estados.ts` (cinco `Transicoes` + `transicaoValida`)

**Guardas:** `regras.ts` (`regrasDoDominio`)

**Agregado:** `brief.ts` (`Brief`, `VocabularioDaInstancia`, `definirBrief`, `efeitosSemObjetivo`)

**Emissão:** `scripts/emitir.ts` → `dist/educate.vocabulario.json` (vocabulário e máquinas; nunca instância)
