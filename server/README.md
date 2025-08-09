# 🚀 URBEX Server - Backend API

Backend completo para URBEX Explorer construido con Node.js y Express.js.

## 📋 Características

- ✅ **Autenticación completa** con Supabase Auth
- ✅ **API REST** con endpoints para locations, auth, users
- ✅ **Middleware de seguridad** (rate limiting, CORS, Helmet)
- ✅ **Validación de datos** con Joi
- ✅ **Manejo de errores** centralizado
- ✅ **Paginación** en listas
- ✅ **Documentación** incluida

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
```

## 🚀 Uso

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `POST /api/auth/forgot-password` - Recuperación de contraseña

### Locations
- `GET /api/locations` - Obtener todas las ubicaciones del usuario
- `POST /api/locations` - Crear nueva ubicación
- `GET /api/locations/:id` - Obtener ubicación específica
- `PUT /api/locations/:id` - Actualizar ubicación
- `DELETE /api/locations/:id` - Eliminar ubicación
- `GET /api/locations/nearby` - Buscar ubicaciones cercanas
- `GET /api/locations/search` - Buscar ubicaciones por nombre

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/preferences` - Obtener preferencias
- `PUT /api/users/preferences` - Actualizar preferencias

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

## 📊 Health Check

El servidor incluye un endpoint de health check:
```
GET /health
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test
```

## 🚀 Despliegue

### Vercel
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático

### Railway
1. Configurar variables de entorno
2. Deploy con un click

## 🔧 Variables de entorno

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
FRONTEND_URL=http://localhost:3000
```

## 📄 Licencia

MIT License
