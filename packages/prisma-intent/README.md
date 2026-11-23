# prisma-intent

Porta de entrada do **PRISMA Intent**: o core e as especializações num pacote só, por subcaminho. Não tem código próprio: cada subcaminho reexporta o pacote com escopo correspondente, na mesma versão.

```ts
import { definirVocabulario } from "prisma-intent"; // @prisma-intent/core
import { definirInstancia } from "prisma-intent/work"; // @prisma-intent/work
```

| Subcaminho | Pacote |
| --- | --- |
| `prisma-intent` | `@prisma-intent/core` |
| `prisma-intent/work` | `@prisma-intent/work` |
| `prisma-intent/educate` | `@prisma-intent/educate` |
| `prisma-intent/sales` | `@prisma-intent/sales` |
| `prisma-intent/funding` | `@prisma-intent/funding` |

Quem quer só uma parte instala o pacote com escopo. A tese e a documentação estão no [repositório](https://github.com/sidartaveloso/prisma-intent).

Licença [MIT](LICENSE).
