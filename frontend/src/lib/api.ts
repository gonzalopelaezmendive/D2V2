// Cliente API para comunicarse con el backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token JWT para autenticación
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: 'include', // Enviar cookies de sesión
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new ApiError(response.status, error.error || error.detalle || 'Error en la solicitud');
  }

  return response.json();
}

// API de Usuarios
export const usuariosApi = {
  registrar: (data: {
    nombre: string;
    edad: number;
    correo?: string;
    perfilClinico: any;
  }) => fetchApi('/api/usuarios/registro', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  obtenerProgreso: (usuarioId: string) =>
    fetchApi(`/api/usuarios/${usuarioId}/progreso`, {
      method: 'GET',
    }),
};

// API de Tutor
export const tutorApi = {
  interaccion: (data: {
    usuarioId: string;
    modo: string;
    temaExamen?: string;
    entradaUsuario?: string;
  }) => fetchApi('/api/tutor/interaccion', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// API de Ejercicios
export const ejerciciosApi = {
  crear: (data: {
    sesionId: string;
    tipo: string;
    nivelDificultad?: number;
    contenido: any;
  }) => fetchApi('/api/ejercicios/crear', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  responder: (data: {
    ejercicioId: string;
    respuestaUsuario: string;
    esCorrecta: boolean;
    intentos?: number;
    pistasUsadas?: string[];
    tiempoRespuestaMs: number;
    estadoEmocional?: string;
  }) => fetchApi('/api/ejercicios/responder', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// API de Sesiones
export const sesionesApi = {
  finalizar: (sesionId: string) =>
    fetchApi(`/api/sesiones/${sesionId}/finalizar`, {
      method: 'POST',
    }),
};

// API de Autenticación OAuth
// MODO DESARROLLO: Usa rutas mock que simulan OAuth sin credenciales reales
const USE_MOCK_OAUTH = true; // Cambiar a false cuando tengas credenciales reales

export const authApi = {
  loginGoogle: (tipo: 'menor' | 'adulto') => {
    const endpoint = USE_MOCK_OAUTH ? '/api/auth/mock/google' : '/api/auth/google';
    window.location.href = `${API_BASE_URL}${endpoint}?tipo=${tipo}`;
  },

  loginMicrosoft: (tipo: 'menor' | 'adulto') => {
    const endpoint = USE_MOCK_OAUTH ? '/api/auth/mock/microsoft' : '/api/auth/microsoft';
    window.location.href = `${API_BASE_URL}${endpoint}?tipo=${tipo}`;
  },

  verificarToken: () => fetchApi('/api/auth/verify', { method: 'GET' }),

  logout: () => fetchApi('/api/auth/logout', { method: 'POST' }),
};

// API de Generación de Ejercicios
export const generarEjerciciosApi = {
  generar: (data: {
    usuarioId: string;
    tipo?: string;
    nivelDificultad?: number;
    cantidad?: number;
  }) => fetchApi('/api/ejercicios/generar', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
