# 🔐 Guía de Configuración OAuth para NexoMind/D2V2

Esta guía te ayudará a configurar las credenciales OAuth necesarias para que los usuarios puedan iniciar sesión con Google y Microsoft.

---

## ✅ **Estado Actual**

### Ya configurado:
- ✅ SESSION_SECRET generado automáticamente
- ✅ JWT_SECRET generado automáticamente
- ✅ Backend con Passport.js configurado
- ✅ Frontend con redirección OAuth implementada
- ✅ PostgreSQL corriendo en Docker

### Pendiente (requiere acción manual):
- ⏳ GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET
- ⏳ MICROSOFT_CLIENT_ID y MICROSOFT_CLIENT_SECRET

---

## 🔵 **1. Configurar Google OAuth**

### Paso 1: Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Click en el selector de proyectos (arriba) → "**Nuevo Proyecto**"
3. Nombre del proyecto: `NexoMind` o `D2V2`
4. Click en "**Crear**"

### Paso 2: Habilitar Google+ API
1. En el menú lateral: "**APIs y Servicios**" → "**Biblioteca**"
2. Buscar: `Google+ API`
3. Click en "**Habilitar**"

### Paso 3: Configurar Pantalla de Consentimiento
1. "**APIs y Servicios**" → "**Pantalla de consentimiento de OAuth**"
2. Tipo de usuario: Seleccionar "**Externo**"
3. Información de la aplicación:
   - **Nombre de la aplicación**: NexoMind
   - **Email de asistencia al usuario**: tu email
   - **Logotipo de la aplicación**: (opcional por ahora)
   - **Dominio de la aplicación**: (dejar vacío por ahora)
   - **Dominios autorizados**: (dejar vacío por ahora)
   - **Email del desarrollador**: tu email
4. Click en "**Guardar y continuar**"
5. **Permisos**: No agregar ninguno adicional (solo los básicos)
6. Click en "**Guardar y continuar**"
7. **Usuarios de prueba**: Agregar tu email y el de personas que probarán la app
8. Click en "**Guardar y continuar**"

### Paso 4: Crear Credenciales OAuth 2.0
1. "**Credenciales**" → "+ **CREAR CREDENCIALES**" → "**ID de cliente de OAuth 2.0**"
2. Tipo de aplicación: "**Aplicación web**"
3. Nombre: `NexoMind Web Client`
4. **Orígenes de JavaScript autorizados**:
   ```
   http://localhost:3000
   ```
5. **URIs de redirección autorizados**:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
   ⚠️ **Importante**: La URL debe ser EXACTA (sin espacios ni / al final)

6. Click en "**Crear**"

### Paso 5: Copiar Credenciales
1. Aparecerá un modal con tus credenciales
2. **Copiar Client ID** (algo como `123456789-abcdefg.apps.googleusercontent.com`)
3. **Copiar Client Secret** (algo como `GOCSPX-tu_secret_aqui`)
4. Abrir archivo `.env` en la raíz del proyecto
5. Reemplazar:
   ```bash
   GOOGLE_CLIENT_ID=tu_client_id_copiado_aqui
   GOOGLE_CLIENT_SECRET=tu_client_secret_copiado_aqui
   ```

---

## 🔷 **2. Configurar Microsoft OAuth (Azure AD)**

### Paso 1: Acceder a Azure Portal
1. Ve a [Azure Portal](https://portal.azure.com/)
2. Inicia sesión con tu cuenta Microsoft

### Paso 2: Registrar Aplicación
1. Buscar en la barra superior: `Azure Active Directory` o `Microsoft Entra ID`
2. En el menú lateral: "**Registros de aplicaciones**"
3. Click en "+ **Nuevo registro**"
4. Configuración:
   - **Nombre**: NexoMind
   - **Tipos de cuenta compatibles**:
     Seleccionar "**Cuentas en cualquier directorio organizativo (cualquier directorio de Microsoft Entra ID: multiinquilino) y cuentas personales de Microsoft (por ejemplo, Skype, Xbox)**"
   - **URI de redirección**:
     - Plataforma: **Web**
     - URL: `http://localhost:3000/api/auth/microsoft/callback`
5. Click en "**Registrar**"

### Paso 3: Copiar Application ID
1. En la página "**Información general**" de tu aplicación registrada
2. **Copiar** el valor de "**Id. de aplicación (cliente)**"
   (Algo como `12345678-1234-1234-1234-123456789abc`)
3. Abrir archivo `.env` y reemplazar:
   ```bash
   MICROSOFT_CLIENT_ID=tu_application_id_copiado_aqui
   ```

### Paso 4: Crear Client Secret
1. En el menú lateral de tu app: "**Certificados y secretos**"
2. Pestaña "**Secretos de cliente**" → "+ **Nuevo secreto de cliente**"
3. Configuración:
   - **Descripción**: NexoMind Web Secret
   - **Expiración**: 24 meses (o la que prefieras)
4. Click en "**Agregar**"
5. ⚠️ **MUY IMPORTANTE**: **COPIAR EL VALOR INMEDIATAMENTE**
   (Aparece en la columna "Valor", algo como `tu_secret_aqui~123456`)
   **No se volverá a mostrar después de cerrar esta página**
6. Abrir archivo `.env` y reemplazar:
   ```bash
   MICROSOFT_CLIENT_SECRET=tu_secret_copiado_aqui
   ```

### Paso 5: Configurar Permisos de API
1. En el menú lateral: "**Permisos de API**"
2. Click en "+ **Agregar un permiso**"
3. Seleccionar "**Microsoft Graph**"
4. Seleccionar "**Permisos delegados**"
5. Buscar y marcar los siguientes permisos:
   - `User.Read`
   - `email`
   - `profile`
6. Click en "**Agregar permisos**"
7. (Opcional) Click en "**Conceder consentimiento de administrador para...**" si aparece

---

## 🚀 **3. Verificar Configuración**

Después de configurar las credenciales OAuth:

### Paso 1: Verificar archivo .env
Tu archivo `.env` debería verse así:

```bash
PORT=3000
ANTHROPIC_API_KEY=sk-ant-api03-...

# PostgreSQL Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/d2v2_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/d2v2_db?schema=public"

# OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_secret_real_aqui

MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc
MICROSOFT_CLIENT_SECRET=tu_secret_real_aqui~123456

# Session & JWT (ya generados)
SESSION_SECRET=58f9b49e55608a2a5102dbfe1e91952fdd91708937807ae419e159faba1ed0c6
JWT_SECRET=9927e05423da806eb50234c4401886a6f3d27e0ea659f193c6730b349f5fc74c

# Callback URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5178
```

### Paso 2: Reiniciar el Backend
```bash
# Detener el proceso actual (Ctrl+C)
npm run dev
```

### Paso 3: Probar OAuth
1. Abrir el navegador en: `http://localhost:5178/`
2. Click en "**Soy un niño o adolescente**"
3. Click en "**Continuar con Google**"
4. Debería redirigir a la pantalla de login de Google
5. Después de autorizar, volver a la app con sesión iniciada

---

## 🔧 **Troubleshooting**

### Error: "redirect_uri_mismatch"
- **Causa**: La URL de callback no coincide exactamente
- **Solución**: Verifica que las URLs en Google/Azure sean EXACTAMENTE:
  - `http://localhost:3000/api/auth/google/callback`
  - `http://localhost:3000/api/auth/microsoft/callback`
  - Sin espacios, sin `/` al final, con `http` (no `https`)

### Error: "invalid_client"
- **Causa**: CLIENT_ID o CLIENT_SECRET incorrectos
- **Solución**: Volver a copiar las credenciales del portal

### Error: "ECONNREFUSED"
- **Causa**: El backend no está corriendo
- **Solución**: Ejecutar `npm run dev` en la raíz del proyecto

---

## 📦 **Producción (Vercel/Neon)**

Cuando despliegues a producción:

1. **Agregar URLs de producción** a Google Cloud Console:
   ```
   https://tudominio.com/api/auth/google/callback
   ```

2. **Agregar URLs de producción** a Azure Portal:
   ```
   https://tudominio.com/api/auth/microsoft/callback
   ```

3. **Configurar variables de entorno en Vercel**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `MICROSOFT_CLIENT_ID`
   - `MICROSOFT_CLIENT_SECRET`
   - `SESSION_SECRET`
   - `JWT_SECRET`
   - `DATABASE_URL` (Neon PostgreSQL)
   - `BACKEND_URL` (URL de tu API en Vercel)
   - `FRONTEND_URL` (URL de tu app)

---

## 🎉 ¡Listo!

Una vez configuradas las credenciales OAuth, el sistema estará completamente funcional:
- ✅ Login con Google
- ✅ Login con Microsoft
- ✅ Consentimiento parental automático para menores
- ✅ Dashboard diferenciado para padres y estudiantes
- ✅ Generación de ejercicios con IA
- ✅ Tracking completo de progreso

---

**¿Necesitas ayuda?** Abre un issue en el repositorio de GitHub.
