# Módulo de Reclamantes

Este documento descreve o módulo de reclamantes, mostrando como todas as páginas e integrações do frontend se conectam ao cliente de API e ao proxy interno do Next.js.

## Visão geral

O módulo de reclamantes suporta os principais fluxos de cadastro e consulta:

- listagem paginada de reclamantes
- criação de um novo reclamante
- visualização de detalhes de um reclamante

No estado atual do projeto, este módulo não possui uma rota de edição completa (`PUT`) ou exclusão, mas já expõe o ciclo de cadastro e leitura essenciais.

## Estrutura do módulo

As páginas do módulo estão organizadas assim:

- [app/reclamantes/page.tsx](app/reclamantes/page.tsx): listagem de reclamantes com paginação e cards de navegação
- [app/reclamantes/new/page.tsx](app/reclamantes/new/page.tsx): formulário de cadastro de novo reclamante
- [app/reclamantes/[id]/page.tsx](app/reclamantes/%5Bid%5D/page.tsx): visualização de detalhes do reclamante

Os tipos usados pelo módulo estão em [src/types/index.ts](src/types/index.ts), em especial `Reclamante` e `CreateReclamanteRequest`.

## Fluxo de integração com API

O frontend nunca chama diretamente a API externa. Todo o tráfego passa por [src/lib/api-client.ts](src/lib/api-client.ts), que centraliza as chamadas de rede.

Para reclamantes, o cliente de API expõe:

- `getReclamantes(page, limit)` para buscar a lista paginada
- `getReclamanteById(id)` para carregar o detalhe do reclamante
- `createReclamante(data)` para criar um novo reclamante

Esses métodos chamam a rota interna do Next.js definida em `app/api/proxy/...` para encaminhar a requisição ao backend real.

## Como a listagem funciona

Em [app/reclamantes/page.tsx](app/reclamantes/page.tsx), o componente:

- usa `useFetch` para carregar os dados de `apiClient.getReclamantes`
- normaliza payloads que podem chegar dentro de `items`, `reclamantes`, `results` ou `data`
- extrai `total` e `pages` para renderizar a navegação de página
- mostra um card por reclamante com botão para ver detalhes

A lógica de normalização é importante porque o backend pode retornar formatos diferentes dependendo do serviço.

## Como a criação funciona

Em [app/reclamantes/new/page.tsx](app/reclamantes/new/page.tsx), o formulário segue este padrão:

- mantém estado local dos campos `nome`, `documento` e `telefone`
- valida no cliente antes de enviar
- monta o payload `CreateReclamanteRequest`
- chama `apiClient.createReclamante(payload)`
- exibe alertas de sucesso ou erro
- redireciona de volta para `/reclamantes` após criação bem-sucedida

A validação inclui padrões simples de CPF/CNPJ e telefone, garantindo que o formulário não envie dados inválidos.

## Como o detalhe funciona

Em [app/reclamantes/[id]/page.tsx](app/reclamantes/%5Bid%5D/page.tsx), a página de detalhe:

- captura `id` de `useParams()` do App Router
- carrega o reclamante com `apiClient.getReclamanteById(id)` via `useFetch`
- extrai o objeto do payload recebido, que pode estar em `data`, `reclamante` ou direto no corpo
- renderiza informações como nome, documento, telefone, id e datas de criação/atualização

O componente também exibe um estado de erro amigável quando o reclamante não está disponível.

## Tipos e cliente de API

Os tipos de formulário e domínio estão em [src/types/index.ts](src/types/index.ts):

- `CreateReclamanteRequest` define `nome`, `documento` e `telefone`
- `Reclamante` representa o registro retornado pela API

No cliente de API ([src/lib/api-client.ts](src/lib/api-client.ts)), os métodos usam a base `reclamantePath()` para montar as URLs internas do proxy.

### Métodos atuais

- `getReclamantes(page, limit)` → busca listagem paginada
- `getReclamanteById(id)` → busca os dados de um reclamante
- `createReclamante(data)` → cria um reclamante

### O que ainda pode ser adicionado

Para expandir o módulo, a implementação natural seria:

- `updateReclamante(id, data)` para edição completa
- `patchReclamante(id, data)` para atualização parcial
- `deleteReclamante(id)` para remoção
- rota de edição em `app/reclamantes/[id]/edit/page.tsx`

## Padrões de implementação

Ao replicar este módulo em outros cadastros, siga estas diretrizes:

1. coloque os tipos de domínio em `src/types/index.ts`
2. adicione as chamadas correspondentes no `apiClient`
3. crie páginas separadas para listagem, criação, detalhe e edição
4. use uma rota de proxy interna quando precisar isolar a API externa do frontend
5. mantenha a validação do formulário no componente e deixe o cliente de API apenas fazer requisições

## Observações finais

O módulo de reclamantes serve como um exemplo leve de cadastro e consulta dentro do projeto. Ele apresenta as melhores práticas atuais do frontend:

- separação clara entre UI e transporte de dados
- normalização de payloads de API
- uso de rotas do App Router para navegar entre listagem, criação e detalhe
- feedback visual de operações bem-sucedidas e erros

Se for preciso adicionar edição ou exclusão, o padrão do projeto já está definido pelo módulo de responsáveis e pode ser adaptado diretamente para reclamantes.
