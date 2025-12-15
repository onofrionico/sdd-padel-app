# Prompt: Comparador de Especificaciones Funcionales

## Objetivo

Evalúa y compara múltiples especificaciones funcionales basándote en el template estándar `spec-template.md`. Genera una tabla comparativa concisa con puntuaciones y una recomendación final.

---

## Instrucciones

Analiza cada especificación funcional proporcionada y evalúa los siguientes criterios en una escala de 1-5:

| Puntuación | Significado |
|------------|-------------|
| 5 | Excelente - Completo, detallado y sigue las mejores prácticas |
| 4 | Bueno - Cumple bien pero con pequeñas mejoras posibles |
| 3 | Aceptable - Cumple lo básico pero falta profundidad |
| 2 | Deficiente - Incompleto o con problemas significativos |
| 1 | Muy deficiente - Falta la sección o es inutilizable |

---

## Criterios de Evaluación

### 1. **Estructura y Completitud** (adherencia al template)
- ¿Contiene todas las secciones obligatorias del template?
- ¿Respeta el formato establecido?

### 2. **User Stories** (calidad y priorización)
- ¿Están priorizadas correctamente (P1, P2, etc.)?
- ¿Son independientemente testeables?
- ¿Incluyen "Why this priority" y "Independent Test"?
- ¿Los escenarios de aceptación siguen el formato Given/When/Then?
- ¿Cubren el flujo feliz y casos de error?

### 3. **Edge Cases** (cobertura de casos límite)
- ¿Identifican condiciones de borde relevantes?
- ¿Son específicos y accionables?
- ¿Cubren errores, concurrencia, validaciones?

### 4. **Functional Requirements** (completitud y claridad)
- ¿Son específicos y medibles (MUST, SHOULD)?
- ¿Cubren todas las operaciones mencionadas en las user stories?
- ¿Están identificados con códigos (FR-001, etc.)?
- ¿Marcan claramente lo que necesita clarificación?

### 5. **Key Entities** (modelado de datos)
- ¿Definen claramente las entidades involucradas?
- ¿Especifican atributos, tipos y restricciones?
- ¿Documentan relaciones entre entidades?

### 6. **Success Criteria** (métricas de éxito)
- ¿Son medibles y verificables?
- ¿Incluyen métricas de rendimiento, calidad y negocio?
- ¿Están identificados con códigos (SC-001, etc.)?

### 7. **Claridad y Legibilidad**
- ¿Es fácil de entender para un desarrollador?
- ¿Evita ambigüedades?
- ¿Usa lenguaje consistente?

### 8. **Implementabilidad**
- ¿Proporciona suficiente detalle para implementar?
- ¿Define comportamientos esperados claramente?
- ¿Especifica códigos HTTP, formatos de respuesta, validaciones?

---

## Formato de Salida Requerido

### Tabla Comparativa

```markdown
| Criterio                     | Spec A | Spec B | Spec C | Notas |
|------------------------------|--------|--------|--------|-------|
| 1. Estructura y Completitud  |   X/5  |   X/5  |   X/5  | ...   |
| 2. User Stories              |   X/5  |   X/5  |   X/5  | ...   |
| 3. Edge Cases                |   X/5  |   X/5  |   X/5  | ...   |
| 4. Functional Requirements   |   X/5  |   X/5  |   X/5  | ...   |
| 5. Key Entities              |   X/5  |   X/5  |   X/5  | ...   |
| 6. Success Criteria          |   X/5  |   X/5  |   X/5  | ...   |
| 7. Claridad y Legibilidad    |   X/5  |   X/5  |   X/5  | ...   |
| 8. Implementabilidad         |   X/5  |   X/5  |   X/5  | ...   |
|------------------------------|--------|--------|--------|-------|
| **TOTAL**                    | XX/40  | XX/40  | XX/40  |       |
```

### Resumen Ejecutivo

Después de la tabla, proporciona:

1. **🏆 Ganador**: Indica cuál spec es la mejor y por qué (1-2 oraciones)
2. **✅ Fortalezas de cada spec**: Lista 2-3 puntos fuertes por spec
3. **⚠️ Áreas de mejora**: Lista 1-2 mejoras clave por spec
4. **📋 Recomendación**: Sugiere si se puede usar algún spec como base o si conviene combinar elementos

---

## Ejemplo de Uso

```
Compara los siguientes specs funcionales usando el prompt de comparación:

1. spec-feature-a.md
2. spec-feature-b.md  
3. spec-feature-c.md

Genera la tabla comparativa y el resumen ejecutivo.
```

---

## Notas Adicionales

- Si un spec está en un idioma diferente, evalúa el contenido, no el idioma
- Prioriza la calidad sobre la cantidad (un spec conciso pero completo es mejor que uno extenso pero vago)
- Considera que el spec será usado por desarrolladores para implementar la feature

