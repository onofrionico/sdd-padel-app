# Prompt: Comparador de Especificações Funcionais

## Objetivo

Avaliar e comparar múltiplas especificações funcionais baseando-se no template padrão `spec-template.md`. Gerar uma tabela comparativa concisa com pontuações e uma recomendação final.

---

## Instruções

Analise cada especificação funcional fornecida e avalie os seguintes critérios em uma escala de 1-5:

| Pontuação | Significado |
|-----------|-------------|
| 5 | Excelente - Completo, detalhado e segue as melhores práticas |
| 4 | Bom - Atende bem mas com pequenas melhorias possíveis |
| 3 | Aceitável - Atende o básico mas falta profundidade |
| 2 | Deficiente - Incompleto ou com problemas significativos |
| 1 | Muito deficiente - Falta a seção ou é inutilizável |

---

## Critérios de Avaliação

### 1. **Estrutura e Completude** (aderência ao template)
- Contém todas as seções obrigatórias do template?
- Respeita o formato estabelecido?

### 2. **User Stories** (qualidade e priorização)
- Estão priorizadas corretamente (P1, P2, etc.)?
- São independentemente testáveis?
- Incluem "Why this priority" e "Independent Test"?
- Os cenários de aceitação seguem o formato Given/When/Then?
- Cobrem o fluxo feliz e casos de erro?

### 3. **Edge Cases** (cobertura de casos limite)
- Identificam condições de borda relevantes?
- São específicos e acionáveis?
- Cobrem erros, concorrência, validações?

### 4. **Functional Requirements** (completude e clareza)
- São específicos e mensuráveis (MUST, SHOULD)?
- Cobrem todas as operações mencionadas nas user stories?
- Estão identificados com códigos (FR-001, etc.)?
- Marcam claramente o que precisa de esclarecimento?

### 5. **Key Entities** (modelagem de dados)
- Definem claramente as entidades envolvidas?
- Especificam atributos, tipos e restrições?
- Documentam relacionamentos entre entidades?

### 6. **Success Criteria** (métricas de sucesso)
- São mensuráveis e verificáveis?
- Incluem métricas de desempenho, qualidade e negócio?
- Estão identificados com códigos (SC-001, etc.)?

### 7. **Clareza e Legibilidade**
- É fácil de entender para um desenvolvedor?
- Evita ambiguidades?
- Usa linguagem consistente?

### 8. **Implementabilidade**
- Fornece detalhes suficientes para implementar?
- Define comportamentos esperados claramente?
- Especifica códigos HTTP, formatos de resposta, validações?

---

## Formato de Saída Requerido

### Tabela Comparativa

```markdown
| Critério                     | Spec A | Spec B | Spec C | Notas |
|------------------------------|--------|--------|--------|-------|
| 1. Estrutura e Completude    |   X/5  |   X/5  |   X/5  | ...   |
| 2. User Stories              |   X/5  |   X/5  |   X/5  | ...   |
| 3. Edge Cases                |   X/5  |   X/5  |   X/5  | ...   |
| 4. Functional Requirements   |   X/5  |   X/5  |   X/5  | ...   |
| 5. Key Entities              |   X/5  |   X/5  |   X/5  | ...   |
| 6. Success Criteria          |   X/5  |   X/5  |   X/5  | ...   |
| 7. Clareza e Legibilidade    |   X/5  |   X/5  |   X/5  | ...   |
| 8. Implementabilidade        |   X/5  |   X/5  |   X/5  | ...   |
|------------------------------|--------|--------|--------|-------|
| **TOTAL**                    | XX/40  | XX/40  | XX/40  |       |
```

### Resumo Executivo

Após a tabela, forneça:

1. **🏆 Vencedor**: Indique qual spec é a melhor e por quê (1-2 frases)
2. **✅ Pontos fortes de cada spec**: Liste 2-3 pontos fortes por spec
3. **⚠️ Áreas de melhoria**: Liste 1-2 melhorias chave por spec
4. **📋 Recomendação**: Sugira se um spec pode ser usado como base ou se convém combinar elementos

---

## Exemplo de Uso

```
Compare as seguintes specs funcionais usando o prompt de comparação:

1. spec-feature-a.md
2. spec-feature-b.md  
3. spec-feature-c.md

Gere a tabela comparativa e o resumo executivo.
```

---

## Notas Adicionais

- Se um spec está em um idioma diferente, avalie o conteúdo, não o idioma
- Priorize qualidade sobre quantidade (um spec conciso mas completo é melhor que um extenso mas vago)
- Considere que o spec será usado por desenvolvedores para implementar a feature

