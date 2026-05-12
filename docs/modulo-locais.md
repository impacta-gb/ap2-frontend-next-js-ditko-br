# Documentação de Locais

Esta documentação descreve o domínio de `Locais` no frontend do sistema de Achados e Perdidos.

## Objetivo

`Locais` representam os pontos onde um item encontrado foi registrado. No frontend, `locais` são usados para:

- exibir a lista de locais registrados
- criar um novo local
- visualizar detalhes de um local existente

## Estrutura de dados

A interface de `Local` usada no frontend está em `src/types/index.ts`:

```ts
export interface Local {
  id: string;
  tipo: string;
  descricao: string;
  bairro: string;
  criado_em: string;
  atualizado_em: string;
}
```

## Rotas do frontend

- `/locais` - lista de locais
- `/locais/new` - formulário para criar um novo local
- `/locais/[id]` - detalhe do local selecionado

## Páginas e componentes

### `app/locais/page.tsx`

- renderiza a lista de `locais`
- usa `useFetch` para carregar dados de `apiClient.getLocais(page, 10)`
- normaliza a resposta da API e apresenta paginação
- exibe um estado vazio quando não há locais encontrados

### `app/locais/new/page.tsx`

- exibe um formulário para cadastro de novo local
- valida os campos: `tipo`, `descricao` e `bairro`
- envia o payload via `apiClient.createLocal(payload)`
- mostra alerta de sucesso ou erro

### `app/locais/[id]/page.tsx`

- carrega o local específico por `id` com `apiClient.getLocalById(id)`
- exibe detalhes do local e informação do item relacionado

## Integração com API

### Cliente de API

A integração `local` está em `src/lib/api-client.ts`:

- `getLocais(page, limit)` - lista locais
- `getLocalById(id)` - detail fetch
- `createLocal(data)` - cria novo local
- `patchLocal(id, data)` - atualiza local
- `deleteLocal(id)` - exclui local

### Proxy do Next.js

O frontend usa proxy para encaminhar chamadas ao backend:

- `app/api/proxy/local/[...path]/route.ts`

Ele encaminha requisições para o backend configurado por:

```env
API_LOCAL_URL
NEXT_PUBLIC_API_LOCAL_URL
```

### Endpoint backend esperado

A rota de proxy monta o caminho apontando para a API local:

- `/api/proxy/local/api/v1/locais`

## Observações

- A lista de locais depende do formato de retorno da API; por isso `app/locais/page.tsx` normaliza várias formas de payload (`data.locais`, `locais`, `items`, `results`).
- Se aparecer `Total` correto mas nenhum item, provavelmente o backend retorna um array com chave diferente e a normalização precisa ser ajustada.
- O cadastro de local não exige `item_id` no frontend, apenas `tipo`, `descricao` e `bairro`.
