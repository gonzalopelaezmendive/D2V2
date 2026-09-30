import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface LoginProps {
  onLoginExitoso: (tipo: 'adulto' | 'menor') => void;
  onRegistroNuevo: () => void;
}

export const Login = ({ onLoginExitoso, onRegistroNuevo }: LoginProps) => {
  const [tipoUsuario, setTipoUsuario] = useState<'adulto' | 'menor' | null>(null);

  const handleOAuthLogin = (provider: string) => {
    console.log(`Iniciando OAuth con ${provider}`);
    // Aquí irá la lógica real de OAuth
    alert(`Conectando con ${provider}... (próximamente)`);
  };

  return (
    <div className="container-d2v2 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Selección de tipo de usuario */}
        {!tipoUsuario && (
          <Card emoji="👋" title="¡Bienvenido a NexoMind!">
            <div className="space-y-6">
              <p className="text-lg leading-loose text-center">
                ¿Quién va a usar la aplicación?
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setTipoUsuario('menor')}
                  className="w-full p-8 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary bg-white hover:bg-d2v2-primary/5 transition-all"
                >
                  <div className="text-5xl mb-4">🧒</div>
                  <div className="text-2xl font-bold mb-2">
                    Soy un niño o adolescente
                  </div>
                  <div className="text-d2v2-neutral-700">
                    Quiero aprender y practicar
                  </div>
                </button>

                <button
                  onClick={() => setTipoUsuario('adulto')}
                  className="w-full p-8 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-secondary bg-white hover:bg-d2v2-secondary/5 transition-all"
                >
                  <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                  <div className="text-2xl font-bold mb-2">
                    Soy padre/madre o tutor
                  </div>
                  <div className="text-d2v2-neutral-700">
                    Supervisaré el uso de la app
                  </div>
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Login para menores */}
        {tipoUsuario === 'menor' && (
          <Card emoji="🧒" title="Inicia sesión">
            <div className="space-y-6">
              <p className="text-lg leading-loose text-center">
                Elige cómo quieres entrar:
              </p>

              {/* Botones de OAuth */}
              <div className="space-y-4">
                <button
                  onClick={() => handleOAuthLogin('Google')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary bg-white hover:bg-d2v2-neutral-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-lg font-bold">Continuar con Google</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('Microsoft')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary bg-white hover:bg-d2v2-neutral-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span className="text-lg font-bold">Continuar con Microsoft</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('Apple')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-900 hover:border-d2v2-neutral-700 bg-d2v2-neutral-900 hover:bg-d2v2-neutral-800 text-white transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-lg font-bold">Continuar con Apple</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('Facebook')}
                  className="w-full p-4 rounded-xl border-2 border-[#1877F2] bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-lg font-bold">Continuar con Facebook</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-d2v2-neutral-600 mb-4">¿Primera vez aquí?</p>
                <Button
                  variant="secondary"
                  emoji="✨"
                  size="md"
                  onClick={onRegistroNuevo}
                >
                  Crear cuenta nueva
                </Button>
              </div>

              <button
                onClick={() => setTipoUsuario(null)}
                className="w-full text-d2v2-neutral-600 hover:text-d2v2-neutral-800 underline"
              >
                ⬅️ Volver
              </button>
            </div>
          </Card>
        )}

        {/* Login para adultos */}
        {tipoUsuario === 'adulto' && (
          <Card emoji="👨‍👩‍👧‍👦" title="Acceso para Padres/Tutores">
            <div className="space-y-6">
              <div className="bg-d2v2-primary/10 border-2 border-d2v2-primary rounded-xl p-4">
                <p className="text-lg leading-loose">
                  <strong>ℹ️ Importante:</strong> Como padre o tutor, podrás supervisar
                  el progreso y aprobar el uso de la aplicación.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleOAuthLogin('Google')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-secondary bg-white hover:bg-d2v2-neutral-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-lg font-bold">Entrar con Google</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('Microsoft')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-secondary bg-white hover:bg-d2v2-neutral-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span className="text-lg font-bold">Entrar con Microsoft</span>
                </button>

                <button
                  onClick={() => handleOAuthLogin('Apple')}
                  className="w-full p-4 rounded-xl border-2 border-d2v2-neutral-900 bg-d2v2-neutral-900 hover:bg-d2v2-neutral-800 text-white transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-lg font-bold">Entrar con Apple</span>
                </button>
              </div>

              <button
                onClick={() => setTipoUsuario(null)}
                className="w-full text-d2v2-neutral-600 hover:text-d2v2-neutral-800 underline"
              >
                ⬅️ Volver
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
