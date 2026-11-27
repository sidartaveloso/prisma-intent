# @prisma-intent/core

## 0.2.0

### Minor Changes

- d5e9eb9: Marcação semântica no texto pelas diretivas genéricas do CommonMark (task-016).
  
  - `@prisma-intent/core`: `Tag` com atributos, `TagNoTexto`, `Trecho`, `TipoDeElemento` com os atributos declarados (valores livres ou enumerados; opcional, obrigatório ou obrigatório quando outro atributo está presente), `RegistroDeTipos` e `registrarTipos`. O core segue sem dependências.
  - `@prisma-intent/tags` (novo): `lerMarcacao(texto, catalogo)` lê `:tipo[rótulo]{#id atributo="valor"}` para trechos, com o intervalo de cada um e falhas tipadas; `escreverMarcacao(trechos)` escreve a forma canônica, inversa da leitura.
