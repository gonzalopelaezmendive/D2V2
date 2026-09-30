import { useEffect, useState } from 'react';
import { setAuthToken, authApi } from '../lib/api';

interface OAuthCallbackProps {
  onSuccess: (userId: string, tipo: 'menor' | 'adulto') => void;
  onError: () => void;
}

export const OAuthCallback = ({ onSuccess, onError }: OAuthCallbackProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const tipo = params.get('tipo') as 'menor' | 'adulto';

        if (!token || !userId || !tipo) {
          throw new Error('Parámetros de autenticación faltantes');
        }

        // Guardar token
        setAuthToken(token);

        // Verificar token
        const verification = await authApi.verificarToken();

        if (verification) {
          setStatus('success');
          setTimeout(() => {
            onSuccess(userId, tipo);
          }, 1000);
        } else {
          throw new Error('Token inválido');
        }
      } catch (error) {
        console.error('Error en OAuth callback:', error);
        setStatus('error');
        setTimeout(() => {
          onError();
        }, 2000);
      }
    };

    handleCallback();
  }, [onSuccess, onError]);

  return (
    <div className="min-h-screen bg-d2v2-neutral-50 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="text-8xl mb-6 animate-bounce">🔄</div>
            <h1 className="text-4xl font-bold mb-4">Verificando...</h1>
            <p className="text-xl text-d2v2-neutral-700">
              Estamos iniciando tu sesión
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-8xl mb-6">✅</div>
            <h1 className="text-4xl font-bold mb-4">¡Listo!</h1>
            <p className="text-xl text-d2v2-neutral-700">
              Redirigiendo...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-8xl mb-6">❌</div>
            <h1 className="text-4xl font-bold mb-4">Ups, algo salió mal</h1>
            <p className="text-xl text-d2v2-neutral-700 mb-6">
              No pudimos completar el inicio de sesión
            </p>
            <p className="text-lg text-d2v2-neutral-600">
              Redirigiendo al inicio...
            </p>
          </>
        )}
      </div>
    </div>
  );
};
