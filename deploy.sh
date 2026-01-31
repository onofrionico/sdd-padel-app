#!/bin/bash

echo "🚀 Preparando deployment de Padel Tournament en Render.com"
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    echo "✅ Repositorio Git inicializado"
else
    echo "✅ Repositorio Git detectado"
fi

# Verificar si hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Hay cambios sin commitear"
    echo "Commiteando cambios..."
    git add .
    git commit -m "Update for Render deployment"
    echo "✅ Cambios commiteados"
fi

echo ""
echo "📋 Archivos de configuración listos:"
echo "  ✅ render.yaml - Configuración de servicios"
echo "  ✅ backend/Dockerfile - Contenedor del backend"
echo "  ✅ .dockerignore - Exclusiones de build"
echo ""
echo "🎯 Servicios a desplegar:"
echo "  - 🗄️  PostgreSQL Database (1GB free)"
echo "  - 🔧 Backend NestJS (Web Service)"
echo "  - 🌐 Frontend React + Vite (Static Site)"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1️⃣  Subir código a GitHub:"
echo "    git remote add origin https://github.com/TU_USUARIO/sdd-padel-app.git"
echo "    git branch -M main"
echo "    git push -u origin main"
echo ""
echo "2️⃣  Ir a Render Dashboard:"
echo "    https://dashboard.render.com"
echo ""
echo "3️⃣  Crear Blueprint:"
echo "    - Click en 'New +' → 'Blueprint'"
echo "    - Conectar tu repositorio de GitHub"
echo "    - Render detectará automáticamente render.yaml"
echo "    - Click en 'Apply'"
echo ""
echo "4️⃣  Esperar deployment (10-15 minutos primera vez)"
echo ""
echo "5️⃣  Obtener URLs:"
echo "    - Backend: https://padel-tournament-backend.onrender.com"
echo "    - Frontend: https://padel-tournament-frontend.onrender.com"
echo "    - API Docs: https://padel-tournament-backend.onrender.com/api"
echo ""
echo "📖 Ver guía completa: cat DEPLOYMENT_STEPS.md"
echo ""
echo "⚠️  Nota: El plan gratuito puede tardar ~30s en arrancar después de inactividad"
