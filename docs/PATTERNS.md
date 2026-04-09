# Padrões de Desenvolvimento - Lost & Found Frontend

Documentação dos padrões e convenções utilizados neste projeto para manter consistência e facilitada manutenção.

---

## Estrutura de Diretórios

```
app/
├── page.js                    # Página inicial
├── layout.js                  # Layout raiz
├── globals.css               # Estilos globais
├── items/
│   ├── page.tsx              # Lista de itens
│   ├── new/
│   │   └── page.tsx          # Criar novo item
│   └── [id]/
│       └── page.tsx          # Detalhe do item
└── devolucoes/
    ├── page.tsx              # Lista de devoluções
    └── new/
        └── page.tsx          # Criar nova devolução

src/
├── components/               # Componentes reutilizáveis
│   ├── index.ts             # Exports centralizados
│   ├── Navbar.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Alert.tsx
│   ├── Badge.tsx
│   └── Loading.tsx
├── hooks/                    # Custom React hooks
│   ├── useApi.ts
│   └── useMockData.ts
├── lib/                      # Utilitários
│   ├── api-client.ts
│   ├── mockData.ts
│   └── utils.ts
└── types/                    # Definições TypeScript
    └── index.ts
```

---

## Padrão de Routing

### Convenção de URLs

Todas as rotas seguem o padrão **RESTful** com nomes em **inglês**:

```
GET    /                      → Página inicial
GET    /items                 → Listar itens encontrados
GET    /items/new             → Formulário criar novo item
GET    /items/[id]            → Detalhes de um item
GET    /devolucoes            → Listar devoluções
GET    /devolucoes/new        → Formulário criar nova devolução
```

### Convenção de Nomes

- **Páginas de listagem**: `/items`, `/devolucoes` (plural)
- **Páginas de criação**: `/items/new`, `/devolucoes/new` (sufixo `new`)
- **Páginas de detalhe**: `/items/[id]`, `/devolucoes/[id]` (dinâmico)
- **Parâmetros de query**: `/devolucoes/new?item_id=123`

---

## Padrão de Estilos

### Sistema de Cores

**Gradientes principais:**
- Navbar: `from-blue-600 via-purple-600 to-pink-600`
- Títulos: `from-blue-600 to-purple-600`
- Página home: `from-blue-50 via-purple-50 to-pink-50`
- Página items: `from-cyan-50 via-blue-50 to-purple-50`
- Página devolucoes: `from-purple-50 via-blue-50 to-cyan-50`

**Dark mode:** Todas as páginas suportam dark mode com sufixo `dark:`

### Estrutura de Página

Todas as páginas seguem este padrão:

```tsx
'use client';

export default function PageName() {
  return (
    <div className="min-h-screen bg-gradient-to-br [...gradiente...] relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[color] mix-blend-multiply blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[color] mix-blend-multiply blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[color] mix-blend-multiply blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Conteúdo */}
      </div>
    </div>
  );
}
```

### Animações CSS

Definidas em `app/globals.css` e aplicadas com classes:

- `animate-slide-up` - Deslizar para cima
- `animate-slide-down` - Deslizar para baixo
- `animate-fade-in` - Aparecer gradualmente
- `animate-scale-in` - Escalar gradualmente
- `hover-lift` - Levantar ao passar mouse
- `hover-scale` - Escalar ao passar mouse
- `hover-glow` - Brilho ao passar mouse

---

## Componentes

### Padrão de Componente

Todos os componentes reutilizáveis estão em `src/components/`:

```tsx
interface ComponentProps {
  // Props específicas
  label?: string;
  variant?: 'primary' | 'secondary';
}

export const Component = ({ label, variant = 'primary' }: ComponentProps) => {
  return (
    // JSX
  );
};
```

### Button

```tsx
<Button 
  variant="primary" | "secondary" | "danger" | "success" | "outline"
  size="sm" | "md" | "lg"
  loading={boolean}
  fullWidth={boolean}
>
  Texto
</Button>
```

### Card

```tsx
<Card>
  <CardHeader>Título</CardHeader>
  <CardBody>Conteúdo</CardBody>
  <CardFooter>Rodapé</CardFooter>
</Card>
```

### Input/Textarea/Select

```tsx
<Input 
  label="Label"
  error="Mensagem de erro"
  placeholder="Placeholder"
  type="text"
/>

<Textarea
  label="Label"
  error="Mensagem de erro"
  rows={4}
/>

<Select
  label="Label"
  error="Mensagem de erro"
  options={[{ value: '1', label: 'Opção 1' }]}
/>
```

### Badge

```tsx
<Badge 
  label="Status"
  variant="success" | "warning" | "danger" | "info" | "default"
/>
```

### Alert

```tsx
<Alert 
  type="success" | "error" | "warning" | "info"
  title="Título"
  message="Mensagem"
  closeable={true}
/>
```

---

## Padrão de Páginas

### Página de Listagem

Estrutura padrão:

```tsx
1. Header com título e botão de criar
2. Grid/Lista de itens com animações
3. Estado vazio (nenhum item)
4. Paginação (se necessário)
```

**Exemplo:** `/items` e `/devolucoes`

### Página de Formulário

Estrutura padrão:

```tsx
1. Header com ícone e título
2. Alert de sucesso/erro (se submeter)
3. Card com formulário
4. Campos validados com erros
5. Botões Salvar e Cancelar
```

**Exemplo:** `/items/new` e `/devolucoes/new`

### Página de Detalhes

Estrutura padrão:

```tsx
1. Botão voltar
2. Card com informações
3. Grid com detalhes
4. Seção de informações adicionais
5. Botões de ações
```

**Exemplo:** `/items/[id]`

---

## Hooks

### useMockData

Simula chamadas de API com dados mockados:

```tsx
const { data, loading, error, refetch } = useMockData(mockData, delayMs);
```

### useApi

Para chamadas reais de API:

```tsx
const { data, error, loading, request } = useApi();
await request(() => apiClient.getItems());
```

### useFetch

Carrega dados ao montar o componente:

```tsx
const { data, error, loading, refetch } = useFetch(
  () => apiClient.getItemById(id),
  [id]
);
```

---

## Tipos TypeScript

Definidos em `src/types/index.ts`:

```typescript
// Item
interface Item {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  status: ItemStatus;
  // ...
}

// Devolução
interface Devolucao {
  id: string;
  item_id: string;
  reclamante_id: string;
  // ...
}

// Respostas da API
interface ApiListResponse<T> {
  data: T[];
  total: number;
  pages: number;
  // ...
}
```

---

## Configurações

### Tailwind CSS

- **Versão:** 4.0
- **Modo:** Just-in-Time (JIT)
- **Plugins:** Nenhum adicional

### TypeScript

- **Strict mode:** Habilitado
- **Path aliases:** 
  - `@/*` → `./*`
  - `@/src/*` → `./src/*`
  - `@/app/*` → `./app/*`

### Next.js

- **Versão:** 16.2.2
- **App Router:** Habilitado (não Pages Router)
- **Turbopack:** Habilitado para builds rápidos

---

## Dependências Principais

```json
{
  "dependencies": {
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "lucide-react": "^1.7.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

---

## Boas Práticas

### 1. Componentes

- Sempre exportar por `src/components/index.ts`
- Usar TypeScript para Props
- Componentes funcionais com hooks

### 2. Páginas

- Use `'use client'` para componentes interativos
- Coloque o z-10 no conteúdo para sobrepor blobs
- Use `max-w-7xl` para largura máxima

### 3. Estilos

- Prefira classes Tailwind
- Use dark mode em todas as páginas
- Mantenha consistência de cores

### 4. Dados

- Mockados em `src/lib/mockData.ts`
- Use `useMockData` para simular API
- Crie types em `src/types/index.ts`

### 5. Performance

- Use `animationDelay` para delays em listas
- Lazy load images quando possível
- Memoize componentes pesados se necessário

---

## Fluxo de Desenvolvimento

1. **Nova página?** Siga estrutura em `Padrão de Páginas`
2. **Novo componente?** Crie em `src/components/`, exporte em `index.ts`
3. **Novo tipo?** Adicione em `src/types/index.ts`
4. **Novos dados mock?** Adicione em `src/lib/mockData.ts`
5. **Commit?** Use padrão: `feat:`, `fix:`, `chore:`, `docs:`

---

## Exemplos Rápidos

### Criar uma nova página
1. Criar pasta `app/novo-recurso/`
2. Criar `page.tsx` com estrutura padrão
3. Adicionar estilos com gradiente apropriado
4. Usar componentes em `src/components/`

### Criar um novo componente
1. Criar `src/components/NovoComponente.tsx`
2. Adicionar em `src/components/index.ts`
3. Usar em qualquer página

### Adicionar novo tipo
1. Adicionar interface em `src/types/index.ts`
2. Usar nos componentes com TypeScript

---

**Versão:** 1.0  
**Data:** Abril 2026  
**Atualizar quando:** Novos padrões forem estabelecidos
