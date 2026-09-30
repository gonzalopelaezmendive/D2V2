import { useRef, useCallback } from 'react';

/**
 * Hook para tracking automático de interacciones del usuario
 * Registra tiempos, intentos y patrones de uso
 */
export const useTracking = () => {
  const startTimeRef = useRef<number>(0);
  const intentosRef = useRef<number>(0);
  const pistasUsadasRef = useRef<string[]>([]);

  // Iniciar tracking de un ejercicio
  const iniciarEjercicio = useCallback(() => {
    startTimeRef.current = Date.now();
    intentosRef.current = 0;
    pistasUsadasRef.current = [];
  }, []);

  // Registrar un intento
  const registrarIntento = useCallback(() => {
    intentosRef.current += 1;
  }, []);

  // Registrar uso de pista
  const registrarPista = useCallback((pista: string) => {
    pistasUsadasRef.current.push(pista);
  }, []);

  // Obtener tiempo transcurrido en ms
  const obtenerTiempoTranscurrido = useCallback((): number => {
    return Date.now() - startTimeRef.current;
  }, []);

  // Obtener datos del tracking
  const obtenerDatosTracking = useCallback(() => {
    return {
      tiempoRespuestaMs: obtenerTiempoTranscurrido(),
      intentos: intentosRef.current,
      pistasUsadas: [...pistasUsadasRef.current],
    };
  }, [obtenerTiempoTranscurrido]);

  // Resetear tracking
  const resetear = useCallback(() => {
    startTimeRef.current = 0;
    intentosRef.current = 0;
    pistasUsadasRef.current = [];
  }, []);

  return {
    iniciarEjercicio,
    registrarIntento,
    registrarPista,
    obtenerTiempoTranscurrido,
    obtenerDatosTracking,
    resetear,
  };
};
