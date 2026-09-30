// Cliente API para comunicarse con el backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
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
