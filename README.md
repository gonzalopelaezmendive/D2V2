# D2V2 - Aplicación de Apoyo Integral para Dislexia

Plataforma adaptativa multi-agente para desarrollo de habilidades de lectura, escritura y estudio en usuarios neurodivergentes.

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Anthropic Claude API (claude-3-5-sonnet-20241022)

**Frontend:** _(En desarrollo)_
- React + TypeScript
- Vite
- Tailwind CSS

**Deployment:**
- Vercel (Frontend + API)
- Neon PostgreSQL (Base de datos serverless)

---

## 🚀 Desarrollo Local

### Requisitos

- Node.js 18+
- Docker (para PostgreSQL local)
- npm o pnpm

### Configuración

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd app-dislexia-ia
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env`:
```env
ANTHROPIC_API_KEY=tu_api_key_aqui
DATABASE_URL="postgresql://postgres:password@localhost:5432/d2v2_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/d2v2_db?schema=public"
```

4. **Iniciar PostgreSQL con Docker**

```bash
docker-compose up -d
```

5. **Ejecutar migraciones de Prisma**

```bash
npm run db:push
```

6. **Generar Prisma Client**

```bash
npm run db:generate
```

7. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 📊 Base de Datos

### Modelos Principales

- **Usuario**: Perfil clínico y datos personales
- **Sesion**: Sesiones de interacción
- **Interaccion**: Conversaciones con la IA
- **Ejercicio**: Ejercicios generados
- **RespuestaEjercicio**: Respuestas y resultados
- **MetricaAgregada**: Analytics y progreso

### Comandos Prisma

```bash
npm run db:studio     # Abrir Prisma Studio (GUI)
npm run db:migrate    # Crear migración
npm run db:push       # Push schema sin migración
npm run db:generate   # Generar Prisma Client
```

---

## 🌐 API Endpoints

### Usuarios

**POST** `/api/usuarios/registro`
```json
{
  "nombre": "Juan",
  "edad": 10,
  "correo": "juan@example.com",
  "perfilClinico": {
    "tipo_dislexia": "fonologica",
    "grafemas_conflictivos": ["b/d", "p/q"]
  }
}
```

**GET** `/api/usuarios/:usuarioId/progreso`
- Obtener estadísticas y progreso completo

### Interacciones

**POST** `/api/tutor/interaccion`
```json
{
  "usuarioId": "clxxx...",
  "modo": "ejercicios_diarios",
  "entradaUsuario": "Quiero practicar rimas"
}
```

### Ejercicios

**POST** `/api/ejercicios/crear`
```json
{
  "sesionId": "clxxx...",
  "tipo": "rimas",
  "nivelDificultad": 2,
  "contenido": {
    "pregunta": "¿Qué palabra rima con 'gato'?",
    "opciones": ["pato", "perro", "casa"],
    "respuestaCorrecta": "pato"
  }
}
```

**POST** `/api/ejercicios/responder`
```json
{
  "ejercicioId": "clxxx...",
  "respuestaUsuario": "pato",
  "esCorrecta": true,
  "tiempoRespuestaMs": 5000,
  "intentos": 1,
  "pistasUsadas": []
}
```

### Sesiones

**POST** `/api/sesiones/:sesionId/finalizar`
- Finaliza la sesión y devuelve métricas

---

## 🚢 Deployment a Vercel + Neon

### 1. Crear base de datos en Neon

1. Ir a [neon.tech](https://neon.tech)
2. Crear un nuevo proyecto
3. Copiar `DATABASE_URL` y `DIRECT_URL`

### 2. Configurar Vercel

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Agregar variables de entorno:
   - `ANTHROPIC_API_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
3. Deploy automático en cada push a `main`

### 3. Ejecutar migraciones en producción

```bash
# Usar Neon's URL en .env temporalmente
npm run db:push
```

O configurar en Vercel:
- Build Command: `prisma generate && npm run build`

---

## 📝 Estructura del Proyecto

```
app-dislexia-ia/
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── src/
│   ├── config/
│   │   └── tutorPrompt.ts     # System prompt de Claude
│   ├── lib/
│   │   └── prisma.ts          # Prisma Client singleton
│   └── index.ts               # API Express
├── docker-compose.yml         # PostgreSQL local
├── .env                       # Variables de entorno (no commitear)
├── .env.example               # Template de variables
└── package.json
```

---

## 🔐 Seguridad

- ✅ Cumplimiento COPPA/GDPR
- ✅ No se almacenan datos sensibles directos
- ✅ API Keys en variables de entorno
- ✅ .env en .gitignore

---

## 📈 Próximos Pasos

- [ ] Frontend React PWA
- [ ] Sistema de autenticación
- [ ] Dashboard de analytics
- [ ] Generación automática de ejercicios con IA
- [ ] Módulo de texto-a-voz accesible
- [ ] Tests automatizados

---

## 📄 Licencia

ISC
