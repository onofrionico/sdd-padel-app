# Prompt: Functional Specifications Comparator

## Objective

Evaluate and compare multiple functional specifications based on the standard `spec-template.md` template. Generate a concise comparison table with scores and a final recommendation.

---

## Instructions

Analyze each provided functional specification and evaluate the following criteria on a scale of 1-5:

| Score | Meaning |
|-------|---------|
| 5 | Excellent - Complete, detailed and follows best practices |
| 4 | Good - Meets requirements well but with minor improvements possible |
| 3 | Acceptable - Meets basics but lacks depth |
| 2 | Poor - Incomplete or with significant issues |
| 1 | Very poor - Section missing or unusable |

---

## Evaluation Criteria

### 1. **Structure and Completeness** (template adherence)
- Does it contain all mandatory sections from the template?
- Does it respect the established format?

### 2. **User Stories** (quality and prioritization)
- Are they correctly prioritized (P1, P2, etc.)?
- Are they independently testable?
- Do they include "Why this priority" and "Independent Test"?
- Do acceptance scenarios follow the Given/When/Then format?
- Do they cover happy path and error cases?

### 3. **Edge Cases** (boundary condition coverage)
- Do they identify relevant boundary conditions?
- Are they specific and actionable?
- Do they cover errors, concurrency, validations?

### 4. **Functional Requirements** (completeness and clarity)
- Are they specific and measurable (MUST, SHOULD)?
- Do they cover all operations mentioned in user stories?
- Are they identified with codes (FR-001, etc.)?
- Do they clearly mark what needs clarification?

### 5. **Key Entities** (data modeling)
- Do they clearly define involved entities?
- Do they specify attributes, types and constraints?
- Do they document relationships between entities?

### 6. **Success Criteria** (success metrics)
- Are they measurable and verifiable?
- Do they include performance, quality and business metrics?
- Are they identified with codes (SC-001, etc.)?

### 7. **Clarity and Readability**
- Is it easy to understand for a developer?
- Does it avoid ambiguities?
- Does it use consistent language?

### 8. **Implementability**
- Does it provide enough detail to implement?
- Does it clearly define expected behaviors?
- Does it specify HTTP codes, response formats, validations?

---

## Required Output Format

### Comparison Table

```markdown
| Criteria                     | Spec A | Spec B | Spec C | Notes |
|------------------------------|--------|--------|--------|-------|
| 1. Structure and Completeness|   X/5  |   X/5  |   X/5  | ...   |
| 2. User Stories              |   X/5  |   X/5  |   X/5  | ...   |
| 3. Edge Cases                |   X/5  |   X/5  |   X/5  | ...   |
| 4. Functional Requirements   |   X/5  |   X/5  |   X/5  | ...   |
| 5. Key Entities              |   X/5  |   X/5  |   X/5  | ...   |
| 6. Success Criteria          |   X/5  |   X/5  |   X/5  | ...   |
| 7. Clarity and Readability   |   X/5  |   X/5  |   X/5  | ...   |
| 8. Implementability          |   X/5  |   X/5  |   X/5  | ...   |
|------------------------------|--------|--------|--------|-------|
| **TOTAL**                    | XX/40  | XX/40  | XX/40  |       |
```

### Executive Summary

After the table, provide:

1. **🏆 Winner**: Indicate which spec is the best and why (1-2 sentences)
2. **✅ Strengths of each spec**: List 2-3 strong points per spec
3. **⚠️ Areas for improvement**: List 1-2 key improvements per spec
4. **📋 Recommendation**: Suggest if one spec can be used as a base or if combining elements is advisable

---

## Usage Example

```
Compare the following functional specs using the comparison prompt:

1. spec-feature-a.md
2. spec-feature-b.md  
3. spec-feature-c.md

Generate the comparison table and executive summary.
```

---

## Additional Notes

- If a spec is in a different language, evaluate the content, not the language
- Prioritize quality over quantity (a concise but complete spec is better than an extensive but vague one)
- Consider that the spec will be used by developers to implement the feature

