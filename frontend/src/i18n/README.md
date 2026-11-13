# Sistema de Internacionalización (i18n)

Este directorio contiene la configuración y archivos de traducción para el sistema de internacionalización de la aplicación.

## Estructura

```
i18n/
├── config.ts           # Configuración principal de i18next
├── locales/
│   ├── es.json        # Traducciones en español
│   ├── en.json        # Traducciones en inglés
│   └── types.d.ts     # Tipos TypeScript para JSON
├── wordings.md        # Inventario completo de textos
└── README.md          # Este archivo
```

## Uso

### En Componentes React

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('header.appName')}</h1>
      <p>{t('dashboard.welcome', { firstName: 'Juan' })}</p>
    </div>
  )
}
```

### En Funciones Utilitarias

```tsx
import i18n from '@/i18n/config'

function formatStatus(status: string) {
  return i18n.t(`tournament.status.${status}`)
}
```

### Cambiar Idioma

```tsx
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  return (
    <button onClick={() => i18n.changeLanguage('en')}>
      English
    </button>
  )
}
```

## Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)**

## Agregar Nuevas Traducciones

1. Agregar la clave y valor en `locales/es.json`
2. Agregar la traducción correspondiente en `locales/en.json`
3. Usar la clave en el componente con `t('clave.anidada')`

## Interpolación

Para textos con variables dinámicas:

```json
{
  "welcome": "Bienvenido, {{firstName}}!"
}
```

```tsx
t('welcome', { firstName: user.firstName })
```

## Pluralización

```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

```tsx
t('items', { count: 5 })
```

## Detección de Idioma

El sistema detecta automáticamente el idioma del usuario en este orden:
1. Preferencia guardada en `localStorage`
2. Idioma del navegador
3. Idioma por defecto (español)

## Componentes Traducidos

Los siguientes componentes ya están traducidos:
- ✅ Header (navegación, botones, menú móvil)
- ✅ LoginForm (formulario completo)
- ✅ RegisterForm (formulario completo)
- ✅ PlayerProfileForm (formulario completo)
- ✅ Footer (todos los enlaces y secciones)
- ✅ LandingPage (página de inicio completa)
- ✅ DashboardPage (dashboard de jugador completo)
- ✅ TournamentForm (formulario de torneos)
- ✅ TournamentCard (tarjeta de torneo)
- ✅ EnrollmentCard (tarjeta de inscripción)
- ✅ EnrollmentForm (formulario de inscripción)
- ✅ AssociationCard (tarjeta de asociación)
- ✅ RankingsTable (tabla de rankings)
- ✅ NotificationItem (item de notificación)
- ✅ ErrorBoundary (manejo de errores)
- ✅ OfflineDetector (detector offline)
- ✅ NotFoundPage (página 404)
- ✅ Utilidades (formateo de categorías, estados)

## Próximos Pasos

- ✅ Todos los componentes principales traducidos
- [ ] Traducir componentes adicionales si se crean nuevos
- [ ] Agregar más idiomas si es necesario (portugués, francés, etc.)
- [ ] Mejorar traducciones existentes basándose en feedback de usuarios
