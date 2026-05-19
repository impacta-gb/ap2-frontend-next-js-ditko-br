# Módulo de Items - Documentação

## Visão Geral

Este documento descreve a implementação completa do módulo **Item** no frontend da aplicação LostFound. O módulo segue o padrão estabelecido pelos módulos de **Responsável** e **Local**.

## Commits da Feature

Esta feature foi desenvolvida em **5 commits separados**, cada um focando em um aspecto específico:

### 1. `feat(types): adicionar tipos para Item`
- **Commit**: `5aea9cc`
- **Arquivo**: `src/types/index.ts`
- **Mudanças**:
  - ✅ `CreateItemRequest` - Interface para criar items
  - ✅ `UpdateItemRequest` - Interface para updates completos (PUT)
  - ✅ `PatchItemRequest` - Interface para updates parciais (PATCH)

### 2. `feat(api-client): implementar endpoints para Item`
- **Commit**: `0e35a0b`
- **Arquivo**: `src/lib/api-client.ts`
- **Mudanças**:
  - ✅ Importação dos tipos de Item
  - ✅ URL da API configurada para `/api/proxy/item`
  - ✅ Método privado `itemPath()` - Construtor de URLs
  - ✅ Método privado `extractItem()` - Extrator de dados de respostas
  - ✅ **8 Endpoints implementados**:
    - `getItems(page, limit)` - Listar items com paginação
    - `getItemById(id)` - Buscar item por ID
    - `getItemsByStatus(status)` - Filtrar por status
    - `createItem(data)` - Criar novo item
    - `updateItem(id, data)` - Update completo (PUT)
    - `patchItem(id, data)` - Update parcial (PATCH)
    - `updateItemStatus(id, status)` - Atualizar status
    - `deleteItem(id)` - Remover item

### 3. `feat(proxy): criar rota de proxy para API de Item`
- **Commit**: `fc4fa1c`
- **Arquivo**: `app/api/proxy/item/[...path]/route.ts`
- **Mudanças**:
  - ✅ Rota dinâmica para proxy de requisições
  - ✅ Suporta variáveis de ambiente: `API_ITEM_URL` ou `NEXT_PUBLIC_API_ITEM_URL`
  - ✅ Fallback para `http://localhost:8001`
  - ✅ Métodos HTTP: GET, POST, PUT, PATCH, DELETE
  - ✅ Gerenciamento correto de headers (hop-by-hop)
  - ✅ Cache desabilitado (`no-store`)

### 4. `feat(items/page): integrar listagem com API real`
- **Commit**: `8b35770`
- **Arquivo**: `app/items/page.tsx`
- **Mudanças**:
  - ✅ Removido `useMockData` com `mockItems`
  - ✅ Adicionado `useFetch()` com `apiClient.getItems(page, 10)`
  - ✅ Tratamento de erros com Alert e botão "Tentar novamente"
  - ✅ Paginação correta usando `items.pages` da API
  - ✅ Loading state implementado
  - ✅ Empty state quando nenhum item
  - ✅ Cards com informações: nome, categoria, status, local, data

### 5. `feat(items/new): integrar formulário com API real`
- **Commit**: `5ba35ca`
- **Arquivo**: `app/items/new/page.tsx`
- **Mudanças**:
  - ✅ Carrega `locais` via `apiClient.getLocais()`
  - ✅ Carrega `responsaveis` via `apiClient.getResponsaveis()`
  - ✅ Loading state enquanto busca dados
  - ✅ Submit usa `apiClient.createItem()` real
  - ✅ Validação completa de formulário
  - ✅ Tratamento de erros com Alert
  - ✅ Sucesso com redirecionamento
  - ✅ Campos: nome, categoria, data_encontro, descrição, local_id, responsavel_id

## Estrutura de Arquivos

```
app/
├── items/
│   ├── page.tsx              # Listagem (integrado com API)
│   ├── new/
│   │   └── page.tsx          # Novo item (integrado com API)
│   └── [id]/
│       └── page.tsx          # Detalhes (já estava OK)
└── api/
    └── proxy/
        └── item/
            └── [...path]/
                └── route.ts  # Novo: Proxy de API

src/
├── types/
│   └── index.ts              # Tipos de Item (atualizado)
├── lib/
│   └── api-client.ts         # Endpoints de Item (adicionados)
└── hooks/
    └── useApi.ts             # Já existia (useFetch, useApi)
```

## Fluxo de Dados

### Listagem de Items
```
UI (items/page.tsx)
  ↓
useFetch(apiClient.getItems)
  ↓
apiClient.getItems()
  ↓
fetch() → /api/proxy/item/api/v1/items?page=1&limit=10
  ↓
Proxy (app/api/proxy/item/[...path]/route.ts)
  ↓
fetch() → http://localhost:8001/api/v1/items?page=1&limit=10
  ↓
Backend API
```

### Criar Item
```
UI (items/new/page.tsx)
  ↓
handleSubmit() → apiClient.createItem(data)
  ↓
fetch() → /api/proxy/item/api/v1/items
  ↓
Proxy
  ↓
fetch() → http://localhost:8001/api/v1/items
  ↓
Backend API → Salva item
  ↓
Redirect → /items
```

## Padrão de Código

O código segue **exatamente** o padrão das entidades `responsavel` e `local`:

✅ **Tipos**: CreateX, UpdateX, PatchX
✅ **API Client**: métodos com extract*()
✅ **Proxy**: rota dinâmica com fallback
✅ **Pages**: useFetch com tratamento de erro
✅ **UX**: Loading, Error, Empty states

## Próximas Etapas

Para que o módulo funcione completamente, o backend deve:

1. ✅ Estar rodando em `http://localhost:8001`
2. ✅ Ter endpoints implementados em `/api/v1/items`:
   - `GET /api/v1/items?page=X&limit=X`
   - `GET /api/v1/items/:id`
   - `GET /api/v1/items/status/:status`
   - `POST /api/v1/items`
   - `PUT /api/v1/items/:id`
   - `PATCH /api/v1/items/:id`
   - `PATCH /api/v1/items/:id/status`
   - `DELETE /api/v1/items/:id`

## Testes

### Testes Recomendados

- [ ] **Listagem**: Verificar se items são carregados da API
- [ ] **Paginação**: Testar navegação entre páginas
- [ ] **Novo Item**: Criar item com formulário válido
- [ ] **Validação**: Tentar submeter com campos vazios
- [ ] **Erro**: Simular falha de API
- [ ] **Detalhes**: Clicar em um item para ver detalhes

### Dados de Teste

```json
{
  "nome": "Chaves de casa",
  "categoria": "Acessórios",
  "data_encontro": "2026-05-09",
  "descricao": "Chaves prateadas com chaveiro azul",
  "local_id": "1",
  "responsavel_id": "1"
}
```

## Observações Importantes

1. **URL da API**: O módulo usa `/api/proxy/item` como rota de proxy
2. **Paginação**: A API deve retornar `pages` no response
3. **Status**: Items têm 3 status possíveis: "disponível", "devolvido", "pendente"
4. **Relacionamentos**: Item pode ter Local e Responsável relacionados

## Commits Detalhados

Para mais informações, consulte:
```bash
git log --oneline main..feat/items
git show <commit-hash>
```

## Autor

Desenvolvido como parte do módulo Item do projeto LostFound.

Data: 9 de Maio de 2026
