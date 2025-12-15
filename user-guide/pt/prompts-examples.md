# Exemplos de Prompts (PT)

Use estes prompts como ponto de partida ao trabalhar com **Specification-Driven Development (SDD)**. Ajuste ao contexto da sua feature e sempre anexe os artefatos (`spec.md`, `plan.md`) quando aplicável. Lembre-se de seguir o workflow: primeiro crie o SPEC (defina O QUE construir), depois o PLAN (defina COMO construí-lo), e finalmente implemente.

> **📚 Guia completo de SDD**: Para uma explicação detalhada sobre a metodologia SDD, seus princípios, workflow e melhores práticas, consulte /specs/user-guide/pt/SDD_GUIDE.MD

## Geração de Spec

O SPEC define **O QUE** deve ser construído, sem detalhes de implementação. Use o template em `specs/templates/spec-template.md` como base.

### Exemplo 1: Feature básica com contexto do projeto
```
Crie um SPEC para "Listagem de itens com filtros". Esta feature permite aos usuários buscar e filtrar produtos no catálogo. Deve suportar dois tipos de usuários: administradores (que veem todo o inventário) e compradores (que filtram por categoria, tags e preço). Nesta fase inicial queremos permitir filtros para 3 categorias principais (Eletrônicos, Móveis, Roupas) e combinações de até 5 tags simultâneas. Os usuários devem poder ver resultados em tempo real com paginação de 20 itens por página.

Use o template em @spec-template.md como base para criar o arquivo @spec.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo. Se encontrar requisitos ambíguos ou informações faltantes, faça perguntas de esclarecimento antes de assumir detalhes.
```

### Exemplo 2: Feature com referência a documentação existente (POST /items)
```
Crie um SPEC para a funcionalidade POST /items que permite criar novos itens no catálogo. Revise o arquivo @items-api.yaml para entender o contexto da API existente e manter consistência com outros endpoints.

Esta feature deve permitir aos usuários criar novos itens com as seguintes informações:
- Campos obrigatórios: name (string, máximo 200 caracteres), category (string, deve existir no catálogo de categorias)
- Campos opcionais: description (string, máximo 1000 caracteres), tags (array de strings, máximo 10 tags, cada tag máximo 50 caracteres), attributes (objeto JSON com atributos personalizados)

Especifique as regras de validação completas (comprimentos máximos, formatos permitidos, caracteres especiais), o que responder em caso de sucesso (status 201, incluir ID gerado e timestamp de criação), e como lidar com erros de validação (status 400 com detalhes) ou conflitos (status 409 se a categoria não existir). Documente se novas categorias são permitidas ou apenas as existentes, limites de tags/attributes, objetivos de performance (tempo de resposta < 500ms), e requisitos de segurança (sanitização de inputs).

Use o template em @spec-template.md como base para criar o arquivo @spec.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo. Se encontrar validações pouco claras ou regras de negócio ambíguas, pergunte antes de assumir.
```

### Exemplo 3: Feature com uso de MCPs para contexto de plataforma
```
Crie um SPEC para implementar um serviço de notificações que use BigQueue do Fury. Preciso que o serviço envie notificações assíncronas quando um novo item é criado. 

Use o namespace de backend e a ferramenta fury__search_sdk_docs para consultar a documentação da biblioteca BigQueue. Execute fury__search_sdk_docs com service="bigqueue", language="go", e uma query específica como "message queue capabilities and usage" para entender como o BigQueue funciona e suas capacidades. Se não conseguir obter informações do MCP ou da ferramenta correspondente, me avise e interrompa a execução. Defina os requisitos funcionais (quais tipos de notificações, para quem, quando), requisitos não funcionais (latência, throughput), e critérios de aceitação.

Use o template em @spec-template.md como base para criar o arquivo @spec.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo. Faça perguntas se algo não estiver claro.
```

### Exemplo 4: Feature relacionada a um spec existente
```
Crie um SPEC para "Atualização de itens" (PUT /items/{id}). Esta feature está relacionada à feature de criação de itens que já está documentada em @spec.md. 

Use o spec criado anteriormente como guia e documentação para manter consistência em validações, estrutura de dados e tratamento de erros. Defina quais campos podem ser atualizados, regras de validação específicas para atualizações, e comportamento quando o item não existe.

Use o template em @spec-template.md como base para criar o arquivo @spec.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo. Se encontrar inconsistências ou precisar de esclarecimentos, pergunte antes de continuar.
```

## Criação de Plan

O PLAN define **COMO** a solução será implementada. Deve ser criado após ter um SPEC validado e deve cobrir todos os requisitos do SPEC.

### Exemplo 1: Plan baseado em SPEC existente
```
Crie um PLAN para implementar "Listagem de itens com filtros" baseado no SPEC em @spec.md.

Projete a arquitetura para GET /items com filtros. Handler aceita query params: ?category=, ?tags= (comma-separated), ?page=, ?limit= (default 20). Service constrói query SQL com WHERE e JOIN item_tags. Response JSON com estrutura {"items": [...], "pagination": {...}}. Erros: 400 se parâmetros inválidos, 200 array vazio se sem resultados. 

Inclua: design técnico completo, estruturas de dados, contratos de API, estratégia de testing (unit, integração, e2e), e tarefas granulares. Revise arquivos existentes do projeto como internal/handlers/item_handlers.go para manter consistência arquitetônica.

Use o template em @plan-template.md como base para criar o arquivo @plan.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo.
```

### Exemplo 2: Plan com referência a implementações similares
```
Crie um PLAN para POST /items baseado no SPEC em @spec.md. 

Revise a implementação existente de GET /items em internal/handlers/item_handlers.go e internal/services/item_service.go para manter consistência em padrões e estrutura. 

Request body segundo schemas/create_item_request.json com campos name (required), category (required), description (optional), tags (optional, max 10). Handler valida schema, retorna 400 com {"error": "validation_failed", "details": [...]} se falhar. Service valida category existe (SELECT categories), retorna 409 se inválida. Storage usa transaction: INSERT items → INSERT item_tags/attributes → COMMIT. Response 201 com header Location: /items/{id} e body com item criado. Timeout DB: 3s, sem retry. 

Inclua métricas (creation_time, validation_errors), tests (unit validações, integration MySQL, contract status 201), e todas as tarefas necessárias para implementação completa.

Use o template em @plan-template.md como base para criar o arquivo @plan.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo.
```

### Exemplo 3: Plan com uso de SDKs do Fury
```
Crie um PLAN para implementar o serviço de notificações usando BigQueue do Fury, baseado no SPEC em @spec.md.

Use o namespace de backend e a ferramenta fury__search_sdk_docs para consultar a documentação da biblioteca BigQueue. Execute fury__search_sdk_docs com service="bigqueue", language="go", e uma query específica como "message queue capabilities and usage" para entender como o BigQueue funciona e suas capacidades. Se não conseguir obter informações do MCP ou da ferramenta correspondente, me avise e interrompa a execução.

Inclua: design técnico do serviço, integração com BigQueue, tratamento de erros e retries, estratégia de testing, métricas de observabilidade, e tarefas granulares de implementação.

Use o template em @plan-template.md como base para criar o arquivo @plan.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo. Certifique-se de cobrir todos os requisitos do SPEC.
```

### Exemplo 4: Plan com revisão de arquitetura existente
```
Crie um PLAN para PUT /items/{id} baseado no SPEC em @spec.md.

Antes de projetar, revise:
- A arquitetura existente em internal/handlers/ e internal/services/
- O SPEC de criação de itens em @spec.md para manter consistência
- Os modelos de dados em internal/models/item.go

Projete a implementação completa incluindo: validações, tratamento de transações, atualização de relacionamentos (tags, attributes), estratégia de testing exaustiva, e todas as tarefas necessárias. Certifique-se de que o plano seja coerente com a arquitetura existente do projeto.

Use o template em @plan-template.md como base para criar o arquivo @plan.md.

IMPORTANTE: Não modifique o template, use-o apenas como referência para estruturar o novo arquivo.
```

## Implementação

Uma vez que você tenha um SPEC validado e um PLAN completo e revisado, pode prosseguir com a implementação.

### Exemplo 1: Implementação com artefatos anexados
```
Implemente a feature "Listagem de itens com filtros" seguindo o PLAN em @plan.md.

Anexo o SPEC (@spec.md) e o PLAN (@plan.md) como referência. Siga o plano passo a passo, implemente todas as tarefas listadas, e certifique-se de cumprir com os padrões de código do projeto definidos em CODING_GUIDELINES.md.
```

### Exemplo 2: Implementação iterativa
```
Implemente a primeira fase de POST /items de acordo com o PLAN em @plan.md, seção "Fase 1: Handler e validações básicas".

Anexo o SPEC (@spec.md) e PLAN (@plan.md) completos. Foque apenas nas tarefas da Fase 1. Uma vez completada, continuaremos com as seguintes fases.
```

## Dicas Adicionais

- **Separar chats**: Crie chats independentes para SPEC, PLAN e implementação para otimizar o uso de tokens
- **Anexar artefatos**: Sempre anexe `spec.md` e `plan.md` quando trabalhar em implementação
- **Referências cruzadas**: Mencione features relacionadas e seus artefatos para manter consistência
- **Perguntas de esclarecimento**: Indique explicitamente ao agente para perguntar quando encontrar ambiguidades
- **Uso de MCPs**: Ao trabalhar com serviços do Fury, use o namespace de backend e a ferramenta fury__search_sdk_docs para consultar a documentação oficial de SDKs. Execute fury__search_sdk_docs com o service correspondente (kvs, bigqueue, os, ds, stream, workqueue, locks, sequence, core), o idioma do seu projeto, e queries específicas sobre a funcionalidade que você precisa implementar. **É importante mencionar ao agente que se não conseguir usar o MCP ou obter informações do MCP, deve parar e mencionar isso a você**. Isso evita que o agente faça suposições incorretas baseadas em conhecimento genérico em vez da documentação oficial do Fury, o que poderia levar a implementações incompatíveis ou incorretas com a plataforma.

