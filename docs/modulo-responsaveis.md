# Módulo de Responsáveis

Este documento descreve o módulo de responsáveis como referência de implementação para os demais módulos do sistema. A intenção é mostrar não só o que a interface faz, mas principalmente como o módulo foi conectado à API e como repetir esse padrão em outras áreas do projeto.

## Visão geral

O módulo de responsáveis cobre o ciclo completo de manutenção de cadastro:

- listagem com paginação e filtro por status
- criação de novo responsável
- visualização de detalhes
- edição completa via PUT
- atualização parcial via PATCH
- alternância de status ativo/inativo
- exclusão

No frontend, esse fluxo está concentrado nas rotas de [app/responsaveis](../app/responsaveis) e no cliente de API em [src/lib/api-client.ts](../src/lib/api-client.ts). A integração com o backend real não é feita diretamente pelas páginas: elas chamam o cliente local, que por sua vez aponta para um proxy interno do Next em [app/api/proxy/responsavel/[...path]/route.ts](../app/api/proxy/responsavel/%5B...path%5D/route.ts).

## Estrutura do módulo

As telas do módulo estão organizadas assim:

- [app/responsaveis/page.tsx](../app/responsaveis/page.tsx): listagem, filtro, ações rápidas de status e exclusão
- [app/responsaveis/new/page.tsx](../app/responsaveis/new/page.tsx): formulário de criação
- [app/responsaveis/[id]/page.tsx](../app/responsaveis/%5Bid%5D/page.tsx): detalhamento, PATCH parcial, status e exclusão
- [app/responsaveis/[id]/edit/page.tsx](../app/responsaveis/%5Bid%5D/edit/page.tsx): edição completa do registro

Os tipos usados por essas telas estão em [src/types/index.ts](../src/types/index.ts), com destaque para `Responsavel`, `CreateResponsavelRequest`, `UpdateResponsavelRequest` e `PatchResponsavelRequest`.

## Fluxo de integração com API

O módulo segue uma arquitetura em três camadas:

1. A tela React coleta e valida os dados.
2. A tela chama o método correspondente em [src/lib/api-client.ts](../src/lib/api-client.ts).
3. O cliente envia a requisição para o proxy do Next em [app/api/proxy/responsavel/[...path]/route.ts](../app/api/proxy/responsavel/%5B...path%5D/route.ts), que encaminha a chamada para o serviço responsável real configurado por variável de ambiente.

Na prática, isso permite que o frontend converse com a API sem depender de chamadas diretas para domínios externos dentro dos componentes.

### Proxy interno

O proxy em [app/api/proxy/responsavel/[...path]/route.ts](../app/api/proxy/responsavel/%5B...path%5D/route.ts) recebe qualquer método HTTP suportado e repassa a requisição ao backend alvo.

Comportamento principal:

- monta a URL final a partir de `API_RESPONSAVEL_URL` ou `NEXT_PUBLIC_API_RESPONSAVEL_URL`
- usa `http://localhost:5002` como fallback local
- preserva cabeçalhos úteis da requisição original
- remove cabeçalhos hop-by-hop que não devem ser reenviados
- repassa corpo, método, query string e resposta original

Esse desenho é o ponto mais importante do módulo para servir de exemplo: o frontend fala com uma rota interna estável, e o proxy se encarrega de encaminhar para o serviço adequado.

## Cliente de API

O arquivo [src/lib/api-client.ts](../src/lib/api-client.ts) concentra todas as chamadas do frontend.

Para responsáveis, o cliente usa a base:

- `RESPONSAVEL: "/api/proxy/responsavel"`

A partir disso, o método privado `responsavelPath()` monta rotas como:

- `/api/proxy/responsavel/api/v1/responsaveis`
- `/api/proxy/responsavel/api/v1/responsaveis/{id}`
- `/api/proxy/responsavel/api/v1/responsaveis/{id}/status`

Isso significa que o frontend não precisa conhecer o host real da API de responsáveis; ele depende apenas da rota local do Next.

### Métodos expostos para o módulo

Os métodos do cliente que sustentam o módulo são:

- `getResponsaveis(page, limit)` para listagem paginada
- `getResponsavelById(id)` para detalhe
- `getResponsaveisByAtivo(value)` para filtro por status
- `createResponsavel(data)` para criação
- `updateResponsavel(id, data)` para PUT completo
- `patchResponsavel(id, data)` para atualização parcial
- `updateResponsavelStatus(id, ativo)` para troca rápida de status
- `deleteResponsavel(id)` para exclusão

O método `request()` é compartilhado e padroniza o tratamento de erro. Ele adiciona `Content-Type: application/json`, valida `response.ok` e extrai `message`, `status` e `details` quando a API retorna erro estruturado.

## Como a listagem funciona

Em [app/responsaveis/page.tsx](../app/responsaveis/page.tsx), a listagem usa `useFetch` para carregar os dados e aceita três modos:

- todos
- somente ativos
- somente inativos

Quando o filtro está em "todos", a tela usa `apiClient.getResponsaveis(page, limit)` e trabalha com paginação vinda da própria API.

Quando o filtro é por status, a tela usa `apiClient.getResponsaveisByAtivo(ativo)`, faz a paginação localmente e exibe o recorte da página atual.

Essa tela também mostra dois padrões úteis para replicar em outros módulos:

- normalização de payloads vindos de formatos diferentes da API
- tratamento visual de erro e de sucesso com `Alert`

## Como a criação funciona

Em [app/responsaveis/new/page.tsx](../app/responsaveis/new/page.tsx), o fluxo de criação segue este padrão:

- estado local para os campos do formulário
- validação simples no cliente antes do envio
- construção explícita do payload `CreateResponsavelRequest`
- envio via `apiClient.createResponsavel(payload)`
- exibição de feedback de sucesso ou erro
- redirecionamento automático para a listagem após o cadastro

Esse é um bom modelo para novos módulos porque separa claramente:

- validação de UI
- montagem do payload
- chamada de API
- tratamento de resposta

## Como o detalhe funciona

Em [app/responsaveis/[id]/page.tsx](../app/responsaveis/%5Bid%5D/page.tsx), a tela de detalhe mostra um segundo padrão importante: ela não serve apenas para leitura.

Além de carregar os dados com `apiClient.getResponsavelById(id)`, a tela também expõe ações diretas sobre o mesmo recurso:

- alternar status com `updateResponsavelStatus`
- excluir com `deleteResponsavel`
- atualizar parcialmente com `patchResponsavel`

Isso torna a página de detalhe uma espécie de centro operacional do registro.

## Como a edição funciona

Em [app/responsaveis/[id]/edit/page.tsx](../app/responsaveis/%5Bid%5D/edit/page.tsx), a lógica é a de um formulário clássico de edição completa:

- carrega o registro atual com `getResponsavelById`
- preenche os campos com os dados retornados
- valida os campos obrigatórios
- monta `UpdateResponsavelRequest`
- envia via `apiClient.updateResponsavel(id, payload)`
- redireciona para o detalhe após salvar

Esse fluxo é útil como referência quando o objetivo é manter um formulário simples, previsível e desacoplado do backend.

## Padrão para reutilizar em outros módulos

Para usar este módulo como modelo em novos cadastros, siga a mesma sequência:

1. Defina os tipos de domínio em [src/types/index.ts](../src/types/index.ts).
2. Adicione os métodos necessários em [src/lib/api-client.ts](../src/lib/api-client.ts).
3. Faça o frontend consumir apenas o cliente interno, nunca a URL real da API diretamente.
4. Crie ou reaproveite um proxy em [app/api/proxy/...](../app/api/proxy) quando o backend exigir isolamento por domínio ou serviço.
5. Separe listagem, criação, detalhe e edição em rotas diferentes.
6. Centralize a validação de formulário na tela e deixe o cliente de API apenas transportar dados.

## O que torna este módulo um bom exemplo

Este módulo é especialmente útil como referência porque ele cobre praticamente todo o espectro de interação com API do projeto:

- GET com listagem paginada
- GET por id
- POST de criação
- PUT de atualização completa
- PATCH de atualização parcial
- PATCH de status
- DELETE

Além disso, ele mostra uma estratégia de integração robusta:

- o frontend acessa uma rota local estável
- o proxy do Next decide para onde encaminhar
- o cliente de API concentra as regras de chamada
- as telas ficam focadas em experiência e validação

## Observação prática

Se você for implementar um novo módulo, o caminho mais seguro é espelhar esta estrutura: tipos no pacote de domínio, métodos no cliente, proxy quando necessário e páginas isoladas por responsabilidade. Isso reduz acoplamento e deixa o comportamento da API previsível para todo o frontend.