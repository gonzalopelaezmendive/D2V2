// Tipos compartidos para D2V2

export interface PerfilClinico {
  tipo_dislexia: 'fonologica' | 'superficial' | 'mixta';
  grafemas_conflictivos: string[];
  procesos_afectados?: string[];
}

export interface Usuario {
  id: string;
  nombre: string;
  edad: number;
  correo?: string;
  perfilClinico: PerfilClinico;
  createdAt: string;
  updatedAt: string;
}

export interface Sesion {
  id: string;
  usuarioId: string;
  fechaInicio: string;
  fechaFin?: string;
  modo: 'ejercicios_diarios' | 'preparacion_examen';
  temaEstudiado?: string;
}

export interface Interaccion {
  id: string;
  sesionId: string;
  timestamp: string;
  contextoInyectado: string;
  respuestaIA: string;
  tokensUsados?: number;
}

export interface Ejercicio {
  id: string;
  sesionId: string;
  interaccionId?: string;
  tiempoInicio: string;
  tiempoFin?: string;
  tipo: string;
  nivelDificultad: number;
  contenido: {
    pregunta: string;
    opciones?: string[];
    respuestaCorrecta?: string;
    pistas?: string[];
    [key: string]: any;
  };
}

export interface RespuestaEjercicio {
  id: string;
  ejercicioId: string;
  timestamp: string;
  respuestaUsuario: string;
  esCorrecta: boolean;
  intentos: number;
  pistasUsadas: string[];
  tiempoRespuestaMs: number;
  estadoEmocional?: 'frustrado' | 'confiado' | 'neutral';
}

export interface MetricaAgregada {
  id: string;
  usuarioId: string;
  fecha: string;
  ejerciciosCompletados: number;
  tasaAcierto: number;
  tiempoPromedioRespuesta: number;
  grafemasProblematicos: string[];
  patronesError: Record<string, any>;
  nivelActual: number;
  rachaActual: number;
}
