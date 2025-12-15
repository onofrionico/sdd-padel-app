# Ejemplos de Prompts (ES)

Usa estos prompts como punto de partida al trabajar con **Specification-Driven Development (SDD)**. Ajusta al contexto de tu feature y adjunta siempre los artefactos (`spec.md`, `plan.md`) cuando corresponda. Recuerda seguir el workflow: primero crea el SPEC (define QUÉ construir), luego el PLAN (define CÓMO construirlo), y finalmente implementa.

> **📚 Guía completa de SDD**: Para una explicación detallada sobre la metodología SDD, sus principios, workflow y mejores prácticas, consulta /specs/user-guide/es/SDD_GUIDE.MD

## Generación de SPEC

El SPEC define **QUÉ** se debe construir, sin detalles de implementación. Usa el template en `specs/templates/spec-template.md` como base.

### Ejemplo 1: Feature básica con contexto del proyecto
```
Crea un SPEC para "Listado de ítems con filtros". Esta feature permite a los usuarios buscar y filtrar productos en el catálogo. Debe soportar dos tipos de usuarios: administradores (que ven todo el inventario) y compradores (que filtran por categoría, tags y precio). En esta fase inicial queremos permitir filtros por 3 categorías principales (Electrónica, Muebles, Ropa) y combinaciones de hasta 5 tags simultáneos. Los usuarios deben poder ver resultados en tiempo real con paginación de 20 ítems por página.

Usa el template en @spec-template.md como base para crear el archivo @spec.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo. Si encuentras requisitos ambiguos o información faltante, hazme preguntas de aclaración antes de asumir detalles.
```

### Ejemplo 2: Feature con referencia a documentación existente (POST /items)
```
Crea un SPEC para la funcionalidad POST /items que permite crear ítems nuevos en el catálogo. Revisa el archivo @items-api.yaml para entender el contexto de la API existente y mantener consistencia con otros endpoints.

Esta feature debe permitir a los usuarios crear nuevos ítems con la siguiente información:
- Campos obligatorios: name (string, máximo 200 caracteres), category (string, debe existir en el catálogo de categorías)
- Campos opcionales: description (string, máximo 1000 caracteres), tags (array de strings, máximo 10 tags, cada tag máximo 50 caracteres), attributes (objeto JSON con atributos personalizados)

Especifica las reglas de validación completas (longitudes máximas, formatos permitidos, caracteres especiales), qué responder en caso de éxito (status 201, incluir ID generado y timestamp de creación), y cómo manejar errores de validación (status 400 con detalles) o conflictos (status 409 si la categoría no existe). Documenta si se permiten categorías nuevas o solo las existentes, límites de tags/attributes, objetivos de performance (tiempo de respuesta < 500ms), y requisitos de seguridad (sanitización de inputs).

Usa el template en @spec-template.md como base para crear el archivo @spec.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo. Si encuentras validaciones poco claras o reglas de negocio ambiguas, pregunta antes de asumir.
```

### Ejemplo 3: Feature con uso de MCPs para contexto de plataforma
```
Crea un SPEC para implementar un servicio de notificaciones que use BigQueue de Fury. Necesito que el servicio envíe notificaciones asíncronas cuando se crea un nuevo ítem. 

Usa el namespace de backend y la herramienta fury__search_sdk_docs para consultar la documentación de la librería BigQueue. Ejecuta fury__search_sdk_docs con service="bigqueue", lenguaje="go", y una query específica como "message queue capabilities and usage" para entender cómo funciona BigQueue y sus capacidades. Si no podes obtener información del MCP o la herramienta correspondiente hazmelo saber y cortá la ejecución. Define los requisitos funcionales (qué tipos de notificaciones, a quién, cuándo), requisitos no funcionales (latencia, throughput), y criterios de aceptación.

Usa el template en @spec-template.md como base para crear el archivo @spec.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo. Haz preguntas si algo no está claro.
```

### Ejemplo 4: Feature relacionada con un spec existente
```
Crea un SPEC para "Actualización de ítems" (PUT /items/{id}). Esta feature está relacionada con la feature de creación de ítems que ya está documentada en @spec.md. 

Utilizá el spec creado anteriormente como guía y documentación para mantener consistencia en validaciones, estructura de datos y manejo de errores. Define qué campos pueden actualizarse, reglas de validación específicas para actualizaciones, y comportamiento cuando el ítem no existe.

Usa el template en @spec-template.md como base para crear el archivo @spec.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo. Si encuentras inconsistencias o necesitas aclaraciones, pregunta antes de continuar.
```

## Creación de PLAN

El PLAN define **CÓMO** se implementará la solución. Debe crearse después de tener un SPEC validado y debe cubrir todos los requisitos del SPEC.

### Ejemplo 1: Plan basado en SPEC existente
```
Crea un PLAN para implementar "Listado de ítems con filtros" basándote en el SPEC en @spec.md.

Diseña la arquitectura para GET /items con filtros. Handler acepta query params: ?category=, ?tags= (comma-separated), ?page=, ?limit= (default 20). Service construye query SQL con WHERE y JOIN item_tags. Response JSON con estructura {"items": [...], "pagination": {...}}. Errores: 400 si parámetros inválidos, 200 array vacío si sin resultados. 

Incluye: diseño técnico completo, estructuras de datos, contratos de API, estrategia de testing (unit, integración, e2e), y tareas granulares. Revisa archivos existentes del proyecto como internal/handlers/item_handlers.go para mantener consistencia arquitectónica.

Usa el template en @plan-template.md como base para crear el archivo @plan.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo.
```

### Ejemplo 2: Plan con referencia a implementaciones similares
```
Crea un PLAN para POST /items basándote en el SPEC en @spec.md. 

Revisa la implementación existente de GET /items en internal/handlers/item_handlers.go e internal/services/item_service.go para mantener consistencia en patrones y estructura. 

Request body según schemas/create_item_request.json con campos name (required), category (required), description (optional), tags (optional, max 10). Handler valida schema, retorna 400 con {"error": "validation_failed", "details": [...]} si falla. Service valida category existe (SELECT categories), retorna 409 si inválida. Storage usa transaction: INSERT items → INSERT item_tags/attributes → COMMIT. Response 201 con header Location: /items/{id} y body con item creado. Timeout DB: 3s, sin retry. 

Incluye métricas (creation_time, validation_errors), tests (unit validaciones, integration MySQL, contract status 201), y todas las tareas necesarias para implementación completa.

Usa el template en @plan-template.md como base para crear el archivo @plan.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo.
```

### Ejemplo 3: Plan con uso de SDKs de Fury
```
Crea un PLAN para implementar el servicio de notificaciones usando BigQueue de Fury, basándote en el SPEC en @spec.md.

Usa el namespace de backend y la herramienta fury__search_sdk_docs para consultar la documentación de la librería BigQueue. Ejecuta fury__search_sdk_docs con service="bigqueue", lenguaje="go", y una query específica como "message queue capabilities and usage" para entender cómo funciona BigQueue y sus capacidades. Si no podes obtener información del MCP o la herramienta correspondiente hazmelo saber y cortá la ejecución.

Incluye: diseño técnico del servicio, integración con BigQueue, manejo de errores y reintentos, estrategia de testing, métricas de observabilidad, y tareas granulares de implementación.

Usa el template en @plan-template.md como base para crear el archivo @plan.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo. Asegúrate de cubrir todos los requisitos del SPEC.
```

### Ejemplo 4: Plan con revisión de arquitectura existente
```
Crea un PLAN para PUT /items/{id} basándote en el SPEC en @spec.md.

Antes de diseñar, revisa:
- La arquitectura existente en internal/handlers/ e internal/services/
- El SPEC de creación de ítems en @spec.md para mantener consistencia
- Los modelos de datos en internal/models/item.go

Diseña la implementación completa incluyendo: validaciones, manejo de transacciones, actualización de relaciones (tags, attributes), estrategia de testing exhaustiva, y todas las tareas necesarias. Asegúrate de que el plan sea coherente con la arquitectura existente del proyecto.

Usa el template en @plan-template.md como base para crear el archivo @plan.md.

IMPORTANTE: No modifiques el template, úsalo solo como referencia para estructurar el nuevo archivo.
```

## Implementación

Una vez que tengas un SPEC validado y un PLAN completo y revisado, puedes proceder con la implementación.

### Ejemplo 1: Implementación con artefactos adjuntos
```
Implementa la feature "Listado de ítems con filtros" siguiendo el PLAN en @plan.md.

Adjunto el SPEC (@spec.md) y el PLAN (@plan.md) como referencia. Sigue el plan paso a paso, implementa todas las tareas listadas, y asegúrate de cumplir con los estándares de código del proyecto definidos en CODING_GUIDELINES.md.
```

### Ejemplo 2: Implementación iterativa
```
Implementa la primera fase de POST /items según el PLAN en @plan.md, sección "Fase 1: Handler y validaciones básicas".

Adjunto el SPEC (@spec.md) y PLAN (@plan.md) completos. Enfócate solo en las tareas de la Fase 1. Una vez completada, continuaremos con las siguientes fases.
```

## Tips adicionales

- **Separar chats**: Crea chats independientes para SPEC, PLAN e implementación para optimizar el uso de tokens
- **Adjuntar artefactos**: Siempre adjunta `spec.md` y `plan.md` cuando trabajes en implementación
- **Referencias cruzadas**: Menciona features relacionadas y sus artefactos para mantener consistencia
- **Preguntas de aclaración**: Indica explícitamente al agente que pregunte cuando encuentre ambigüedades
- **Uso de MCPs**: Cuando trabajes con servicios de Fury, usa el namespace de backend y la herramienta fury__search_sdk_docs para consultar la documentación oficial de SDKs. Ejecuta fury__search_sdk_docs con el service correspondiente (kvs, bigqueue, os, ds, stream, workqueue, locks, sequence, core), el lenguaje de tu proyecto, y queries específicas sobre la funcionalidad que necesitas implementar. **Es importante mencionarle al agente que si no puede usar el MCP u obtener información del MCP, debe detenerse y mencionártelo**. Esto evita que el agente haga suposiciones incorrectas basadas en conocimiento genérico en lugar de la documentación oficial de Fury, lo cual podría llevar a implementaciones incompatibles o incorrectas con la plataforma.


