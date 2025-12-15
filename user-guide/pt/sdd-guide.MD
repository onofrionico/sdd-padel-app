# Manual do usuário: Desenvolvimento guiado por especificações (SDD)

Este manual orienta você pela metodologia de Specification-Driven Development (SDD) para construir features de software. Você aprenderá a criar SPECs completos que definem **o que** deve ser construído, PLANs detalhados que especificam **como** implementar, e boas práticas para trabalhar de forma eficaz com assistentes de IA ao longo de todo o ciclo de desenvolvimento.

---

## 🎯 Recomendação: Desenvolvimento iterativo com SDD

### Construção progressiva de contexto

Trabalhar com **Specification-Driven Development (SDD)** melhora significativamente quando é documentado de forma iterativa:

- **Features relacionadas**: Ao concluir uma feature, você pode iniciar outra relacionada referenciando a anterior
- **Contexto cumulativo**: Cada SPEC e PLAN documentado enriquece o contexto do projeto
- **Aprendizado do agente**: Desenvolver múltiplas features com esse framework permite que o agente:
  - Entenda melhor a arquitetura do projeto
  - Mantenha consistência nos padrões de implementação
  - Reutilize soluções e estruturas anteriores
  - Reduza o tempo de especificação para features semelhantes

### Benefícios da abordagem iterativa

- **Documentação viva**: O histórico de SPECs e PLANs funciona como documentação em evolução do projeto
- **Melhoria contínua**: Cada iteração refina o processo e a qualidade das especificações
- **Conhecimento compartilhado**: Facilita o onboarding de novos desenvolvedores no projeto
- **Rastreabilidade**: Mantém um registro claro de decisões técnicas e de negócio

> **Recomendação**: Organize as features em pastas dentro de `specs/` e mantenha referências cruzadas entre features relacionadas. Isso cria um grafo de conhecimento que potencializa o desenvolvimento assistido por IA.

### Incentivar perguntas de esclarecimento

Instrua o agente a fazer perguntas quando encontrar requisitos ambíguos ou pouco claros. Isso evita suposições e garante especificações mais precisas.

**Prompt de exemplo**:
```
"@spec-template create a spec considering: {your spec definition here}. 
If you encounter any ambiguous requirements, unclear business rules, or 
missing information, please ask me clarifying questions before making 
assumptions. I prefer to provide explicit guidance rather than having 
you infer unclear details."
```

---

## O que é um SPEC?

Um **SPEC** é um documento de especificação que define **O QUE** deve ser construído, sem entrar em detalhes de implementação.

### Conteúdo obrigatório

- **Caso de uso**: Descrição do problema a ser resolvido e dos fluxos de usuário
- **Requisitos funcionais**: O que o sistema deve fazer
- **Requisitos não funcionais**: Performance, segurança, escalabilidade
- **Critérios de aceitação**: Condições que determinam se a solução é bem-sucedida
- **Objetivos de negócio**: Objetivos de alto nível que justificam o desenvolvimento
- **Tratamento de erros**: Comportamento esperado em situações inesperadas

### Princípios fundamentais

✅ **Fazer:**
- Revisar o documento constantemente
- Explicar **O QUE** será alcançado
- Incluir requisitos técnicos de alto nível

### Recomendações

- **Ferramentas**: Use Fury for Development MCP para contexto de plataforma e SDKs ou o MCP do namespace backend
- **Referências**: Inclua documentação do projeto, regras existentes, imagens ou screenshots do Figma e guias técnicos relevantes para que o agente entenda o contexto e possa criar uma definição melhor no SPEC
- **Modelos sugeridos**: "gpt-5.1-codex", "gpt-5-codex", "gpt-5.1" ou "gemini-2.5-pro" (modelos com capacidade de raciocínio e análise)
- **Não incluir** detalhes de implementação, trechos de código ou caminhos de arquivos.
- **Modelos não recomendados**: Não usar o modelo "composer-1" do Cursor.

---

## O que é um PLAN?

Um **PLAN** é um documento técnico que define **COMO** a solução descrita no SPEC será implementada.

### Conteúdo obrigatório

- **Desenho técnico**: Arquitetura e componentes da solução
- **Implementação**: Como os requisitos do SPEC serão atendidos
- **Bibliotecas e dependências**: Bibliotecas, SDKs e frameworks a serem utilizados
- **Estruturas de dados**: Modelos de banco de dados, esquemas, migrações
- **Contratos de API**: Corpos de requisição/resposta, headers, status codes
- **Estratégia de testes**: Tipos de testes (unitários, integração, e2e) e cobertura esperada
- **Tarefas detalhadas**: Lista granular de atividades a serem concluídas (pode estar em arquivo separado)

### Princípios fundamentais

✅ **Fazer:**
- Cobrir todos os requisitos do SPEC
- Explicar **COMO** será realizado
- Detalhar a implementação específica do projeto
- Incluir tarefas com alta granularidade

### Recomendações

- **Formato**: Arquivo `.md` ou ferramentas de "plan mode" no IDE/CLI
- **Referências**: Inclua arquivos existentes do projeto como exemplos de implementações similares
- **Modelos sugeridos**: Use "claude-sonnet-4.5" ou "gpt-5.1-codex" para tarefas de código e implementação; "gpt-5.1-codex-mini" para mudanças mais econômicas; "gpt-5.1" para criação de planos

#### ⚠️ Revisão crítica do plano

Uma revisão exaustiva do plano é **fundamental** antes de iniciar a implementação:

- **Completude das tarefas**: Verifique se todas as tarefas de implementação e testes estão presentes
- **Critérios de desenvolvimento**: Valide o cumprimento dos padrões de código, convenções e boas práticas do projeto
- **Arquitetura**: Revise se o design proposto é coerente com a arquitetura existente
- **Cobertura de testes**: Confirme que os testes unitários, de integração e e2e estão incluídos quando apropriado
- **Dependências**: Valide que todas as bibliotecas e SDKs necessários foram identificados e estão corretos
- **Contratos de API**: Verifique se todos os endpoints, requests e responses estão definidos
- **Tratamento de erros**: Garanta que cenários de erro e recuperação estão contemplados
- **Iteração**: Revise e refine o plano até que ele cubra todos os requisitos do SPEC

> **Importante**: Um erro ou falta de detalhe no plano será propagado para a implementação. Investir tempo na revisão evita retrabalho posteriormente.

---

## 🚀 Quando iniciar a implementação?

A implementação deve começar **apenas** quando os seguintes critérios de qualidade forem atendidos:

### Critérios de aprovação para iniciar o desenvolvimento

#### ✅ SPEC validado
- **Revisão completa**: O SPEC foi revisado de forma abrangente
- **Casos de uso cobertos**: Todos os casos de uso e fluxos de usuário estão documentados
- **Requisitos claros**: Requisitos funcionais e não funcionais são específicos e mensuráveis
- **Critérios de aceitação**: Estão definidos e são verificáveis

#### ✅ PLAN completo
- **Arquitetura definida**: O desenho técnico é coerente com o projeto existente
- **Fluxos implementados**: Todos os fluxos de dados e de controle estão especificados
- **Tratamento de erros**: Os cenários de erro e recuperação estão contemplados
- **Testes incorporados**: A estratégia de testes (unitário, integração, e2e) está definida
- **Tarefas granulares**: Todas as tarefas de implementação estão identificadas e priorizadas
- **Dependências identificadas**: Bibliotecas, SDKs e serviços externos estão especificados

### ⚠️ Se os critérios não forem atendidos

**NÃO inicie a implementação**. Em vez disso:

1. Identifique as áreas faltantes ou incompletas
2. Revise e complete o SPEC e/ou o PLAN, conforme necessário
3. Itere até que todos os critérios de aprovação sejam atendidos
4. Valide novamente antes de prosseguir

### Benefícios dessa disciplina

- **Implementação eficiente**: O código flui naturalmente seguindo o plano
- **Menos retrabalho**: Erros detectados na especificação são mais baratos de corrigir
- **Maior qualidade**: Os testes são integrados desde a fase de design
- **Melhor estimativa**: Tarefas granulares permitem um acompanhamento de progresso mais preciso
- **Redução de bugs**: Casos de borda e tratamento de erros são considerados desde o início

> **Regra de ouro**: Se você tiver dúvidas sobre a completude do SPEC ou do PLAN, **NÃO implemente**. Invista tempo primeiro em esclarecer. Uma hora de planejamento pode economizar horas ou dias de correções.

---

## Workflow

```
1. SPEC → Define O QUE construir (sem implementação)
2. PLAN → Define COMO construir (com implementação)
3. Development → Executa o plano
```

---

## 📋 Uso dos templates

Os templates de SPEC e PLAN localizados em `specs/templates/` fornecem uma estrutura padronizada para a documentação.

### ⚠️ Importante

- **Não modificar os templates**: Os arquivos em `specs/templates/` devem permanecer inalterados
- **Copiar e completar**: Crie cópias dos templates na pasta da feature específica
- **Manter a estrutura**: Respeite as seções definidas nos templates para manter a consistência do projeto

---

## 💰 Gestão de tokens e contexto

### ⚠️ Alerta sobre consumo de tokens

O processo de criação de SPEC e PLAN pode consumir uma quantidade significativa de tokens e de janela de contexto.

### Recomendações para otimizar o consumo

1. **Separar por fases**: Crie chats independentes para cada fase de desenvolvimento
   - Chat 1: Geração do SPEC
   - Chat 2: Geração do PLAN (anexando o SPEC como referência)
   - Chat 3: Implementação (anexando SPEC e PLAN como referência)

2. **Reutilizar documentação**: Os arquivos de SPEC e PLAN gerados são documentos completos que podem ser anexados em novos chats
   - Evita repetir todo o contexto em cada conversa
   - Reduz significativamente o consumo de tokens
   - Mantém a coerência entre as fases

3. **Vantagens de separar os chats**:
   - Maior eficiência no uso de tokens
   - Contexto mais limpo e focado em cada etapa
   - Menor risco de atingir os limites da janela de contexto
   - Melhor organização do trabalho

> **Dica**: Ao iniciar um novo chat para implementação, anexe os arquivos `spec.md` e `plan.md` gerados anteriormente. Isso fornece todo o contexto necessário sem consumir a janela de contexto de forma desnecessária.
