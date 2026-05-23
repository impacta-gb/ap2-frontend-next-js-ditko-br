# Módulo de Devoluções

Este documento descreve o módulo de **Devoluções** do frontend do projeto LostFound, seguindo o padrão dos demais módulos (Responsáveis, Reclamantes, Locais e Items).

## Visão geral

O módulo de devoluções tem como objetivo gerenciar o fluxo pelo qual um item encontrado é devolvido ao seu reclamante. Cobre as telas de listagem, criação de devolução, detalhe e edição parcial quando aplicável.

Principais fluxos:

- Listagem paginada de devoluções
- Registrar nova devolução (associar item, reclamante, data e observações)
- Visualizar detalhe de uma devolução
- Atualizar parcialmente (PATCH) observações/status

## Estrutura de arquivos (frontend)

```
app/
├── devolucoes/
│   ├── page.tsx           # Listagem de devoluções
│   ├── new/
│   │   └── page.tsx       # Formulário para registrar devolução
│   └── [id]/
│       ├── page.tsx       # Detalhes da devolução
│       └── edit/
│           └── page.tsx   # Edição completa
└── api/
    └── proxy/
        └── devolucao/
            └── [...path]/
                └── route.ts # Proxy para o backend de devoluções

src/
├── lib/
│   └── api-client.ts      # Endpoints de devoluções (via proxy)
└── types/
    └── index.ts           # Tipos: Devolucao, CreateDevolucaoRequest, PatchDevolucaoRequest
```

## Tipos esperados

No arquivo `src/types/index.ts` o módulo deve definir (exemplo):

```ts
export interface Devolucao {
  id: string;
  item_id: string;
  reclamante_id?: string | null;
  data_devolucao: string;
  observacao?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface CreateDevolucaoRequest {
  item_id: string;
  reclamante_id?: string;
  data_devolucao?: string;
  observacao?: string;
}

export interface PatchDevolucaoRequest {
  observacao?: string;
}
```

## Rotas e páginas do frontend

- `/devolucoes` — lista paginada de devoluções (usar `useFetch` e `apiClient.getDevolucoes(page, limit)`)
- `/devolucoes/new` — formulário para registrar nova devolução (carregar `items`e `reclamantes` para seleção)
- `/devolucoes/[id]` — detalhe da devolução (exibir item, destinatário e datas)
- (opcional) `/devolucoes/[id]/edit` — edição completa via PUT

## Cliente de API (recomendações)

Adicionar métodos em `src/lib/api-client.ts` seguindo o padrão dos outros módulos:

- `devolucaoPath()` — monta a base `/api/proxy/devolucao`
- `extractDevolucao()` / `extractDevolucaoArray()` — normalizadores de envelope
- `getDevolucoes(page, limit)` — listagem paginada
- `getDevolucaoById(id)` — buscar devolução por id
- `createDevolucao(data)` — criar devolução (POST)
- `patchDevolucao(id, data)` — atualização parcial (PATCH)
- `deleteDevolucao(id)` — remover (se aplicável)

Todas as chamadas devem usar a rota de proxy do Next.js (`app/api/proxy/devolucao/[...path]/route.ts`) para manter isolamento do host real da API.

## Fluxo de dados (exemplo: criar devolução)

```
UI (devolucoes/new/page.tsx)
  ↓
apiClient.createDevolucao(payload)
  ↓
fetch() → /api/proxy/devolucao/api/v1/devolucoes
  ↓
Proxy (app/api/proxy/devolucao/[...path]/route.ts)
  ↓
fetch() → BACKEND_DEVOLUCAO_URL/api/v1/devolucoes
  ↓
Backend → salva devolução
  ↓
Frontend → redireciona para /devolucoes
```

## UX e validações

- No formulário de criação, validar campos obrigatórios: `item_id` e `reclamante_id`.
- Se `data_devolucao` não for informada, preencher com a data atual no backend ou no cliente.
- Usar componentes `SearchableSelect` para selecionar `item` e `reclamante` por nome (enviar `id` no payload).
- Mostrar `Loading`, `Empty` e `Error` states consistentes com os demais módulos.
- Exibir `observacao` somente se estiver preenchida (evitar mostrar "Não informado").

## Observações de integração

- Normalizar envelopes de resposta no cliente (aceitar `data`, `results`, `items`, etc.).
- Retornar `total` e `pages` para paginação quando possível; caso contrário, calcular `pages` a partir de `total` e `limit`.
- Proteger endpoints com tratamento de erros centralizado (`ApiErrorHandler`) e mensagens de usuário amigáveis.

## Testes recomendados

- Listagem: confirma carregamento e paginação correta
- Criação: registrar devolução válida e verificar redirecionamento
- Validação: tentar submeter sem `item_id` ou destinatário e garantir erro de validação
- Detalhe: abrir página de detalhe e confirmar campos (item, destinatário, datas, observação)

Data: 22 de Maio de 2026
