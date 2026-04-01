# Sistema de Achados e Perdidos - Frontend

Frontend oficial do Sistema de Achados e Perdidos, desenvolvido em Next.js para consumo das APIs FastAPI do ecossistema Ditko.br.

## Sobre o projeto

Este repositório representa a camada de interface do mesmo sistema descrito no backend, mantendo o mesmo domínio de negócio e as mesmas entidades.

O sistema permite o registro, busca e devolução de itens perdidos, conectando pessoas que encontraram objetos com seus proprietários legítimos.

Projeto desenvolvido pelo grupo Ditko.br para a disciplina de Frameworks Full Stack, ministrada pelo professor Giovani Bontempo na Faculdade Impacta.

### Entidades principais

#### Item

- id: Identificador único
- nome: Nome/descrição breve do item
- categoria: Classificação do item (eletrônicos, documentos etc.)
- data_encontro: Data em que o item foi encontrado
- descricao: Descrição detalhada do item
- status: Status atual (disponível, devolvido etc.)

#### Local

- id: Identificador único
- tipo: Tipo do local (sala, corredor etc.)
- descricao: Descrição específica do local
- bairro: Bairro onde o local está situado

#### Responsável

- id: Identificador único
- nome: Nome completo
- cargo: Cargo/função do responsável
- telefone: Telefone para contato
- ativo: Status de atividade no sistema

#### Devolução

- id: Identificador único
- data_devolucao: Data em que o item foi devolvido
- observacao: Observações sobre a devolução

#### Reclamante

- id: Identificador único
- nome: Nome completo
- documento: Documento de identificação
- telefone: Telefone para contato

### Relacionamentos

- Item - Local: Um item é encontrado em um local (N:1)
- Item - Responsável: Um item é registrado por um responsável (N:1)
- Item - Devolução: Um item pode ter uma devolução (1:0..1)
- Devolução - Reclamante: Uma devolução é retirada por um reclamante (N:1)

## Tecnologias utilizadas

### Frontend

- Next.js (App Router)
- React
- TypeScript
- ESLint + Prettier
- Vitest + React Testing Library

### Integração

- APIs REST em FastAPI
- Contratos de dados compartilhados por domínio

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Serviços backend do sistema em execução

## Instalação

Clone o repositório do frontend:

```bash
git clone <https://github.com/ap2-frontend-next-js-ditko-br>
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Sistema de Achados e Perdidos
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Este sistema utiliza arquitetura separada por serviços. Configure os endpoints por domínio:

```env
NEXT_PUBLIC_API_ITEM_URL=http://localhost:8001
NEXT_PUBLIC_API_LOCAL_URL=http://localhost:8002
NEXT_PUBLIC_API_RESPONSAVEL_URL=http://localhost:8003
NEXT_PUBLIC_API_DEVOLUCAO_URL=http://localhost:8004
NEXT_PUBLIC_API_RECLAMANTE_URL=http://localhost:8005
```

Execute em desenvolvimento:

```bash
npm run dev
```

Aplicação disponível em: http://localhost:3000

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Estrutura sugerida

```text
src/
  app/                 # rotas e layouts (App Router)
  components/          # componentes reutilizáveis
  features/            # módulos por domínio (item, local, devolucao etc.)
  services/            # clientes HTTP e integração com APIs
  hooks/               # hooks customizados
  lib/                 # utilitários
  styles/              # estilos globais
  types/               # tipos compartilhados
public/                # assets estáticos
```

## Padrões de desenvolvimento

- Separação clara entre UI, estado e integração com API
- Componentes reutilizáveis e orientados a domínio
- Tratamento centralizado de erro de requisição
- Tipagem forte com TypeScript

## Testes

- Testes unitários para lógica de negócio
- Testes de componentes para fluxos críticos

Executar testes:

```bash
npm run test
```

## Docker (opcional)

```bash
docker build -t achados-perdidos-frontend .
docker run -p 3000:3000 achados-perdidos-frontend
```

## Contribuição

1. Crie uma branch a partir da main
2. Implemente a funcionalidade
3. Garanta lint e testes passando
4. Abra um Pull Request com contexto da mudança

## Autores

### Grupo Ditko.br

Projeto desenvolvido para a disciplina de Frameworks Full Stack.

Instituição: Faculdade Impacta

Professor: Giovani Bontempo

Integrantes:

- Ryan Rodrigues Cordeiro
- Felipe Wilson Viana
- Iago Rozales

---

Projeto Acadêmico - Frameworks Full Stack | Prof. Giovani Bontempo | Faculdade Impacta
