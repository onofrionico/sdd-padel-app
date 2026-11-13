# Pasos para Desplegar en Render.com

## ✅ Archivos de Configuración Creados

Ya están listos:
- ✅ `render.yaml` - Configuración de servicios
- ✅ `backend/Dockerfile` - Contenedor del backend
- ✅ `.dockerignore` - Archivos a excluir del build

## 🚀 Deployment Paso a Paso

### Paso 1: Subir Código a GitHub

```bash
# Si aún no tienes un repositorio remoto
git init
git add .
git commit -m "Add Render deployment configuration"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/sdd-padel-app.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Render

1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Crea una cuenta o inicia sesión
3. Click en **"New +"** → **"Blueprint"**
4. Selecciona **"Connect a repository"**
5. Autoriza Render para acceder a tu GitHub
6. Selecciona el repositorio `sdd-padel-app`

### Paso 3: Aplicar Blueprint

1. Render detectará automáticamente el archivo `render.yaml`
2. Verás una vista previa de los 3 servicios:
   - 🗄️ **padel-tournament-db** (PostgreSQL)
   - 🔧 **padel-tournament-backend** (Web Service)
   - 🌐 **padel-tournament-frontend** (Static Site)
3. Click en **"Apply"**

### Paso 4: Esperar el Deployment

- ⏱️ Primera vez: 10-15 minutos
- Render creará:
  - Base de datos PostgreSQL
  - Backend con Docker
  - Frontend estático
  - Conexiones automáticas entre servicios

### Paso 5: Verificar Deployment

Una vez completado, obtendrás URLs como:
- **Backend**: `https://padel-tournament-backend.onrender.com`
- **Frontend**: `https://padel-tournament-frontend.onrender.com`
- **API Docs**: `https://padel-tournament-backend.onrender.com/api`

Prueba el backend:
```bash
curl https://padel-tournament-backend.onrender.com/api/ping
```

## 🔧 Configuración Automática

Render configurará automáticamente:

### Variables de Entorno del Backend
- ✅ `DATABASE_HOST` → Conectado a PostgreSQL
- ✅ `DATABASE_PORT` → Conectado a PostgreSQL
- ✅ `DATABASE_USERNAME` → Conectado a PostgreSQL
- ✅ `DATABASE_PASSWORD` → Conectado a PostgreSQL
- ✅ `DATABASE_NAME` → Conectado a PostgreSQL
- ✅ `JWT_SECRET` → Generado automáticamente
- ✅ `JWT_EXPIRATION` → 1d
- ✅ `NODE_ENV` → production
- ✅ `PORT` → 3000

### Variables de Entorno del Frontend
- ✅ `VITE_API_BASE_URL` → URL del backend automáticamente

## 📊 Monitoreo

### Ver Logs
1. Ve al [Dashboard de Render](https://dashboard.render.com)
2. Click en cada servicio
3. Pestaña **"Logs"** para ver logs en tiempo real

### Ver Estado
- Dashboard muestra estado de cada servicio
- Health checks automáticos cada 30 segundos

## 🔄 Actualizar la Aplicación

Cada vez que hagas push a GitHub, Render redesplegará automáticamente:

```bash
git add .
git commit -m "Update application"
git push origin main
```

## ⚠️ Limitaciones del Plan Gratuito

- **Servicios se duermen** después de 15 minutos de inactividad
- **Primera petición** tarda ~30 segundos en despertar
- **750 horas/mes** por servicio (suficiente para 1 servicio 24/7)
- **PostgreSQL**: 1GB de almacenamiento, 90 días de retención

## 🆘 Troubleshooting

### Backend no arranca
1. Ve a Dashboard → padel-tournament-backend → Logs
2. Busca errores en el build o startup
3. Verifica que todas las variables de entorno estén configuradas

### Frontend no conecta con Backend
1. Verifica que `VITE_API_BASE_URL` tenga la URL correcta del backend
2. Revisa CORS en `backend/src/main.ts` (ya está habilitado)
3. Verifica que el backend esté corriendo

### Base de datos no conecta
1. Ve a Dashboard → padel-tournament-db
2. Verifica que esté "Available"
3. Revisa logs del backend para errores de conexión

### Ejecutar Migraciones Manualmente

Si necesitas ejecutar migraciones después del deployment:

1. Ve a Dashboard → padel-tournament-backend
2. Click en **"Shell"** (requiere plan de pago)
3. O usa la API de Render para ejecutar comandos

**Alternativa**: Agrega un script de inicio que ejecute migraciones automáticamente:

```typescript
// En backend/src/main.ts, antes de app.listen():
import { DataSource } from 'typeorm';

async function runMigrations() {
  const dataSource = new DataSource({
    // tu configuración
  });
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}

// En bootstrap():
if (process.env.NODE_ENV === 'production') {
  await runMigrations();
}
```

## 💰 Costos

### Plan Free (Actual)
- ✅ $0/mes
- ✅ 750 horas/servicio
- ✅ PostgreSQL 1GB
- ✅ Static sites ilimitados
- ⚠️ Servicios se duermen

### Plan Starter ($7/mes por servicio)
- ✅ Sin límite de horas
- ✅ No se duerme
- ✅ PostgreSQL 10GB
- ✅ Más CPU/RAM

## 📚 Recursos

- [Documentación Render](https://render.com/docs)
- [Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

## ✅ Checklist Final

Antes de desplegar, verifica:
- [ ] Código subido a GitHub
- [ ] Cuenta creada en Render.com
- [ ] Repositorio conectado a Render
- [ ] Blueprint aplicado
- [ ] Servicios desplegados exitosamente
- [ ] URLs funcionando
- [ ] Backend responde en `/api/ping`
- [ ] Frontend carga correctamente
- [ ] Frontend puede comunicarse con Backend
