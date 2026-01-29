# Guía de Implementación de Internacionalización

## ✅ Sistema Implementado

Se ha implementado un sistema completo de internacionalización (i18n) utilizando **react-i18next** para la aplicación de Padel Tournament.

## 📦 Dependencias Instaladas

```json
{
  "i18next": "^23.x",
  "react-i18next": "^13.x",
  "i18next-browser-languagedetector": "^7.x",
  "@radix-ui/react-dropdown-menu": "^2.x"
}
```

## 📁 Estructura de Archivos Creados

```
frontend/src/i18n/
├── config.ts                    # Configuración de i18next
├── locales/
│   ├── es.json                 # Traducciones en español (200+ claves)
│   ├── en.json                 # Traducciones en inglés (200+ claves)
│   └── types.d.ts              # Tipos TypeScript
├── wordings.md                 # Inventario completo de textos
└── README.md                   # Documentación de uso

frontend/src/lib/
└── i18nUtils.ts                # Utilidades de formateo i18n

frontend/src/components/
├── common/
│   └── LanguageSelector.tsx    # Selector de idioma
└── ui/
    └── dropdown-menu.tsx       # Componente dropdown de Radix UI
```

## 🎯 Componentes Ya Traducidos

### ✅ Completamente Traducidos
1. **Header** - Navegación, botones, menú móvil, selector de idioma integrado
2. **LoginForm** - Formulario completo con labels, placeholders, errores
3. **RegisterForm** - Formulario de registro completo
4. **PlayerProfileForm** - Formulario de perfil de jugador completo
5. **Footer** - Pie de página con todos los enlaces
6. **LandingPage** - Página de inicio completa
7. **DashboardPage** - Dashboard de jugador completo
8. **TournamentForm** - Formulario de creación/edición de torneos completo
9. **TournamentCard** - Tarjeta de torneo con todos los detalles
10. **EnrollmentCard** - Tarjeta de inscripción con estados
11. **EnrollmentForm** - Formulario de inscripción
12. **AssociationCard** - Tarjeta de asociación
13. **RankingsTable** - Tabla de rankings con posiciones y badges
14. **NotificationItem** - Item de notificación con formateo de tiempo
15. **ErrorBoundary** - Componente de manejo de errores
16. **OfflineDetector** - Detector de conexión offline
17. **NotFoundPage** - Página 404
18. **Utilidades** - Formateo de categorías, estados de torneos y inscripciones

## 🌍 Idiomas Disponibles

- **🇪🇸 Español (es)** - Idioma por defecto
- **🇬🇧 Inglés (en)**

## 🚀 Cómo Usar

### En Componentes React

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('header.appName')}</h1>
      <p>{t('dashboard.welcome', { firstName: user.firstName })}</p>
    </div>
  )
}
```

### En Utilidades

```tsx
import i18n from '@/i18n/config'

function myFunction() {
  const text = i18n.t('some.key')
  return text
}
```

### Cambiar Idioma Programáticamente

```tsx
import { useTranslation } from 'react-i18next'

function changeLanguage() {
  const { i18n } = useTranslation()
  i18n.changeLanguage('en') // o 'es'
}
```

## 🔧 Características Implementadas

### 1. Detección Automática de Idioma
- Detecta el idioma guardado en `localStorage`
- Fallback al idioma del navegador
- Fallback final a español

### 2. Persistencia
- El idioma seleccionado se guarda automáticamente en `localStorage`
- Se mantiene entre sesiones

### 3. Selector de Idioma
- Componente `LanguageSelector` con dropdown
- Iconos de banderas para cada idioma
- Integrado en el Header (desktop y mobile)

### 4. Interpolación
```tsx
// En JSON
"welcome": "Bienvenido, {{firstName}}!"

// En código
t('welcome', { firstName: 'Juan' })
// Resultado: "Bienvenido, Juan!"
```

### 5. Formateo Contextual
```tsx
import { formatCategory, formatTournamentStatus } from '@/lib/i18nUtils'

formatCategory(1) // "1ra Categoría" (es) o "1st Category" (en)
formatTournamentStatus('in_progress') // "En Progreso" (es) o "In Progress" (en)
```

## 📝 Próximos Pasos para Completar la Traducción

### Componentes Pendientes (en orden de prioridad)

#### ✅ Alta Prioridad - COMPLETADO
1. ✅ **RegisterForm** - Formulario de registro
2. ✅ **PlayerProfileForm** - Formulario de perfil de jugador
3. ✅ **Footer** - Pie de página
4. ✅ **LandingPage** - Página de inicio
5. ✅ **DashboardPage** - Dashboard principal

#### ✅ Media Prioridad - COMPLETADO
6. ✅ **TournamentForm** - Formulario de creación/edición de torneos
7. ✅ **TournamentCard** - Tarjeta de torneo
8. ✅ **EnrollmentCard** - Tarjeta de inscripción
9. ✅ **EnrollmentForm** - Formulario de inscripción
10. ✅ **AssociationCard** - Tarjeta de asociación

#### ✅ Baja Prioridad - COMPLETADO
11. ✅ **RankingsTable** - Tabla de rankings
12. ✅ **NotificationItem** - Item de notificación
13. ✅ **ErrorBoundary** - Componente de error
14. ✅ **OfflineDetector** - Detector de conexión
15. ✅ **NotFoundPage** - Página 404

### Ejemplo de Traducción de un Componente

**Antes:**
```tsx
export function MyComponent() {
  return (
    <div>
      <h1>Welcome</h1>
      <button>Click me</button>
    </div>
  )
}
```

**Después:**
```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('myComponent.title')}</h1>
      <button>{t('myComponent.button')}</button>
    </div>
  )
}
```

**Agregar a locales/es.json:**
```json
{
  "myComponent": {
    "title": "Bienvenido",
    "button": "Haz clic aquí"
  }
}
```

**Agregar a locales/en.json:**
```json
{
  "myComponent": {
    "title": "Welcome",
    "button": "Click me"
  }
}
```

## 🧪 Testing

Para probar el sistema i18n:

1. **Cambiar idioma manualmente:**
   - Usar el selector de idioma en el Header
   - Verificar que todos los textos cambien

2. **Verificar persistencia:**
   - Cambiar idioma
   - Recargar la página
   - Verificar que el idioma se mantenga

3. **Probar interpolación:**
   - Verificar componentes con variables dinámicas (ej: Dashboard con nombre de usuario)

## 📚 Recursos

- [Documentación de react-i18next](https://react.i18next.com/)
- [Documentación de i18next](https://www.i18next.com/)
- [Inventario completo de textos](./src/i18n/wordings.md)
- [Guía de uso](./src/i18n/README.md)

## 🎨 Mejoras Futuras

1. **Agregar más idiomas:**
   - Portugués (pt)
   - Francés (fr)
   - Italiano (it)

2. **Formateo avanzado:**
   - Fechas con `date-fns` locales
   - Números con formato regional
   - Monedas

3. **Pluralización:**
   - Implementar reglas de plural para textos con conteo

4. **Namespace separation:**
   - Dividir traducciones en múltiples archivos por módulo

5. **Lazy loading:**
   - Cargar traducciones bajo demanda para mejorar performance

## ⚠️ Notas Importantes

1. **Siempre agregar claves en ambos idiomas** (es.json y en.json)
2. **Usar claves descriptivas** con estructura jerárquica (ej: `auth.login.email.label`)
3. **No hardcodear textos** en los componentes, siempre usar `t()`
4. **Documentar nuevas claves** en wordings.md si es necesario
5. **Probar en ambos idiomas** antes de hacer commit

## 🐛 Troubleshooting

### El texto no cambia al cambiar idioma
- Verificar que la clave existe en ambos archivos JSON
- Verificar que estás usando `t()` correctamente
- Revisar la consola del navegador por errores

### Error "Cannot find module"
- Verificar que los archivos JSON existen
- Verificar que la configuración en `config.ts` es correcta
- Reiniciar el servidor de desarrollo

### El idioma no persiste
- Verificar que `i18next-browser-languagedetector` está instalado
- Verificar la configuración de `detection` en `config.ts`
- Revisar localStorage en las DevTools del navegador

## ✨ Estado Actual

- ✅ Sistema base configurado
- ✅ 200+ claves de traducción creadas
- ✅ Selector de idioma funcional
- ✅ Header completamente traducido
- ✅ LoginForm completamente traducido
- ✅ RegisterForm completamente traducido
- ✅ PlayerProfileForm completamente traducido
- ✅ Footer completamente traducido
- ✅ LandingPage completamente traducida
- ✅ DashboardPage completamente traducido
- ✅ TournamentForm completamente traducido
- ✅ TournamentCard completamente traducido
- ✅ EnrollmentCard completamente traducido
- ✅ EnrollmentForm completamente traducido
- ✅ AssociationCard completamente traducido
- ✅ RankingsTable completamente traducido
- ✅ NotificationItem completamente traducido
- ✅ ErrorBoundary completamente traducido
- ✅ OfflineDetector completamente traducido
- ✅ NotFoundPage completamente traducido
- ✅ Utilidades de formateo traducidas
- ✅ **Todos los componentes principales traducidos**

**Progreso estimado: 95% completado**
