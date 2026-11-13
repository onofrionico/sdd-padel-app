# Guía de Deployment en Render.com

## Requisitos Previos

1. **Cuenta en Render.com**: Crea una cuenta gratuita en [render.com](https://render.com)
2. **Git**: Tu proyecto debe estar en un repositorio Git
3. **Node.js**: Versión 18 o superior

## Opción 1: Deployment Automático (Recomendado)

### Paso 1: Conectar con GitHub/GitLab

1. Sube tu código a GitHub o GitLab
2. Ve a [Render Dashboard](https://dashboard.render.com)
3. Click en "New +" → "Blueprint"
4. Conecta tu repositorio
5. Render detectará automáticamente el archivo `render.yaml`
6. Click en "Apply" para desplegar

### Paso 2: Configurar Variables de Entorno (Opcional)

Render configurará automáticamente:
- Base de datos PostgreSQL
- Conexión entre servicios
- JWT Secret (generado automáticamente)

Si necesitas agregar variables adicionales:
1. Ve a cada servicio en el dashboard
2. Settings → Environment
3. Agrega las variables necesarias

## Opción 2: Deployment Manual con CLI

### Instalación de Render CLI

```bash
npm install -g @render/cli
```

### Autenticación

```bash
render login
```

### Deployment

```bash
# Opción A: Usar el script automatizado
chmod +x deploy.sh
./deploy.sh

# Opción B: Comando directo
render blueprint launch
```

## Estructura de Servicios

El archivo `render.yaml` configura:

### 1. Base de Datos PostgreSQL
- **Nombre**: padel-tournament-db
- **Plan**: Free
- **Base de datos**: padel_tournament

### 2. Backend (NestJS)
- **Nombre**: padel-tournament-backend
- **Tipo**: Web Service (Docker)
- **Puerto**: 3000
- **Health Check**: `/api/ping`
- **Variables de entorno**: Conectadas automáticamente a la BD

### 3. Frontend (React + Vite)
- **Nombre**: padel-tournament-frontend
- **Tipo**: Static Site
- **Build**: `npm install && npm run build`
- **Output**: `./frontend/dist`
- **API URL**: Conectada automáticamente al backend

## URLs de Producción

Después del deployment, tus servicios estarán disponibles en:

- **Backend**: `https://padel-tournament-backend.onrender.com`
- **Frontend**: `https://padel-tournament-frontend.onrender.com`
- **API Docs**: `https://padel-tournament-backend.onrender.com/api`

## Limitaciones del Plan Gratuito

- Los servicios se duermen después de 15 minutos de inactividad
- Primera petición después de inactividad tarda ~30 segundos
- 750 horas/mes de uso (suficiente para 1 servicio 24/7)
- Base de datos PostgreSQL: 1GB de almacenamiento

## Monitoreo y Logs

### Ver logs en tiempo real:

```bash
# Backend
render logs -s padel-tournament-backend

# Frontend
render logs -s padel-tournament-frontend
```

### Dashboard Web:
Ve a [dashboard.render.com](https://dashboard.render.com) para:
- Ver estado de servicios
- Revisar logs
- Configurar variables de entorno
- Ver métricas de uso

## Actualizar Deployment

### Automático (con Git):
```bash
git add .
git commit -m "Update application"
git push origin main
```

Render detectará el push y redesplegará automáticamente.

### Manual:
```bash
render deploy -s padel-tournament-backend
render deploy -s padel-tournament-frontend
```

## Troubleshooting

### Backend no arranca
1. Verifica logs: `render logs -s padel-tournament-backend`
2. Revisa que las variables de entorno estén configuradas
3. Verifica que el Dockerfile esté correcto

### Frontend no conecta con Backend
1. Verifica que `VITE_API_BASE_URL` apunte al backend correcto
2. Revisa CORS en el backend
3. Verifica que el backend esté corriendo

### Base de datos no conecta
1. Verifica que las variables `DATABASE_*` estén configuradas
2. Revisa los logs del backend
3. Verifica que la base de datos esté activa en el dashboard

## Migrar Base de Datos

Para ejecutar migraciones después del deployment:

```bash
# Conectarse al servicio
render shell -s padel-tournament-backend

# Ejecutar migraciones
npm run migration:run
```

## Costos

- **Plan Free**: $0/mes
  - 750 horas de servicio
  - PostgreSQL 1GB
  - Static sites ilimitados

- **Plan Starter**: $7/mes por servicio
  - Sin límite de horas
  - No se duerme
  - PostgreSQL 10GB

## Soporte

- Documentación: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Status: [status.render.com](https://status.render.com)
