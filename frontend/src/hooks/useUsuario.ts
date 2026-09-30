import { useState, useEffect } from 'react';
import { Usuario } from '../types';

/**
 * Hook para manejar el estado del usuario actual
 * Persiste en localStorage para mantener sesión
 */
export const useUsuario = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('d2v2_usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistir usuario en localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('d2v2_usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('d2v2_usuario');
    }
  }, [usuario]);

  const actualizarUsuario = (nuevoUsuario: Usuario | null) => {
    setUsuario(nuevoUsuario);
    setError(null);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('d2v2_usuario');
  };

  return {
    usuario,
    loading,
    error,
    actualizarUsuario,
    cerrarSesion,
    setLoading,
    setError,
  };
};
