# Sistema de Achados e Perdidos - Frontend

<img width="1024" height="559" alt="image" src="https://i.imgur.com/J3bQLvW.png"/>

Frontend oficial do sistema Lost & Found, desenvolvido em Next.js para consumo das APIs FastAPI.

## Sobre o projeto

Este repositório representa a camada de interface do mesmo sistema descrito no backend, mantendo o mesmo domínio de negócio e as mesmas entidades.

O sistema permite o registro, busca e devolução de itens perdidos, conectando pessoas que encontraram objetos com seus proprietários legítimos.

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
```

Este sistema utiliza arquitetura separada por serviços. Configure os endpoints por domínio:

```env
NEXT_PUBLIC_API_ITEM_URL=http://localhost:5000
NEXT_PUBLIC_API_LOCAL_URL=http://localhost:5001
NEXT_PUBLIC_API_RESPONSAVEL_URL=http://localhost:5002
NEXT_PUBLIC_API_DEVOLUCAO_URL=http://localhost:5003
NEXT_PUBLIC_API_RECLAMANTE_URL=http://localhost:5004
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

Projeto desenvolvido para a disciplina de Frameworks Full Stack:

**Instituição:** Faculdade Impacta

**Professor:**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/giovbon">
        <img src="https://github.com/giovbon.png" width="100px;" alt="Giovani Bontempo"/><br>
        <sub><b>Giovani Bontempo</b></sub>
      </a>
    </td>
  </tr>
</table>

**Integrantes:**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Ryanditko">
        <img src="https://github.com/Ryanditko.png" width="100px;" alt="Ryan Rodrigues Cordeiro"/><br>
        <sub><b>Ryan Rodrigues Cordeiro</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Felipewv93">
        <img src="https://github.com/Felipewv93.png" width="100px;" alt="Felipe Wilson Viana"/><br>
        <sub><b>Felipe Wilson Viana</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Iago-RM">
        <img src="https://github.com/Iago-RM.png" width="100px;" alt="Iago Rozales"/><br>
        <sub><b>Iago Rozales</b></sub>
      </a>
    </td>
  </tr>
</table>

## Contato

Para mais informações sobre o projeto, entre em contato através do repositório no GitHub.

---

Projeto Acadêmico - Frameworks Full Stack | Prof. Giovani Bontempo | Faculdade Impacta
