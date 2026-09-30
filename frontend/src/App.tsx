import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { ConsentimientoParental } from './pages/ConsentimientoParental';
import { Dashboard } from './pages/Dashboard';
import { Ejercicios } from './pages/Ejercicios';
import { Progreso } from './pages/Progreso';
import { OAuthCallback } from './pages/OAuthCallback';
import { DashboardPadres } from './pages/DashboardPadres';

type Vista =
  | 'login'
  | 'registro'
  | 'consentimiento'
  | 'dashboard'
  | 'ejercicios'
  | 'preparacion-examen'
  | 'progreso'
  | 'oauth-callback';

function App() {
  const [vistaActual, setVistaActual] = useState<Vista>('login');
  const [usuarioActual, setUsuarioActual] = useState<{
    id?: string;
    nombre: string;
    edad: number;
    tipoUsuario?: 'menor' | 'adulto';
    consentimientoAprobado?: boolean;
  } | null>(null);

  // Verificar si es un callback de OAuth
  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      setVistaActual('oauth-callback');
    }
  }, []);

  const handleLoginExitoso = (tipo: 'adulto' | 'menor') => {
    // Mock de login exitoso
    if (tipo === 'menor') {
      setUsuarioActual({
        nombre: 'Juan',
        edad: 10,
        consentimientoAprobado: false,
      });
      setVistaActual('consentimiento');
    } else {
      // Vista de supervisión para padres (próximamente)
      alert('Dashboard de padres - próximamente');
    }
  };

  const handleRegistroExitoso = (usuarioId: string) => {
    setUsuarioActual({
      id: usuarioId,
      nombre: 'Nuevo Usuario',
      edad: 10,
      consentimientoAprobado: false,
    });
    setVistaActual('consentimiento');
  };

  const handleConsentimientoAprobado = () => {
    if (usuarioActual) {
      setUsuarioActual({
        ...usuarioActual,
        consentimientoAprobado: true,
      });
      setVistaActual('dashboard');
    }
  };

  const handleConsentimientoRechazado = () => {
    setUsuarioActual(null);
    setVistaActual('login');
  };

  const handleOAuthSuccess = (userId: string, tipo: 'menor' | 'adulto') => {
    setUsuarioActual({
      id: userId,
      nombre: 'Usuario OAuth', // Se actualizará con datos reales
      edad: tipo === 'menor' ? 10 : 35,
      tipoUsuario: tipo,
      consentimientoAprobado: tipo === 'adulto',
    });

    if (tipo === 'menor') {
      setVistaActual('consentimiento');
    } else {
      setVistaActual('dashboard'); // Dashboard de padres
    }
  };

  const handleOAuthError = () => {
    setVistaActual('login');
  };

  return (
    <div className="min-h-screen bg-d2v2-neutral-50">
      {/* OAuth Callback */}
      {vistaActual === 'oauth-callback' && (
        <OAuthCallback
          onSuccess={handleOAuthSuccess}
          onError={handleOAuthError}
        />
      )}

      {/* Login */}
      {vistaActual === 'login' && (
        <Login
          onLoginExitoso={handleLoginExitoso}
          onRegistroNuevo={() => setVistaActual('registro')}
        />
      )}

      {/* Registro */}
      {vistaActual === 'registro' && (
        <Registro onRegistroExitoso={handleRegistroExitoso} />
      )}

      {/* Consentimiento Parental */}
      {vistaActual === 'consentimiento' && usuarioActual && (
        <ConsentimientoParental
          nombreMenor={usuarioActual.nombre}
          edadMenor={usuarioActual.edad}
          onAprobar={handleConsentimientoAprobado}
          onRechazar={handleConsentimientoRechazado}
        />
      )}

      {/* Dashboard */}
      {vistaActual === 'dashboard' && usuarioActual && (
        <>
          {usuarioActual.tipoUsuario === 'adulto' ? (
            <DashboardPadres
              nombre={usuarioActual.nombre}
              onCerrarSesion={() => {
                setUsuarioActual(null);
                setVistaActual('login');
              }}
            />
          ) : (
            <Dashboard
              nombre={usuarioActual.nombre}
              onIniciarEjercicios={() => setVistaActual('ejercicios')}
              onIniciarExamen={() => setVistaActual('preparacion-examen')}
              onVerProgreso={() => setVistaActual('progreso')}
            />
          )}
        </>
      )}

      {/* Ejercicios */}
      {vistaActual === 'ejercicios' && (
        <Ejercicios onFinalizar={() => setVistaActual('dashboard')} />
      )}

      {/* Preparación de Examen */}
      {vistaActual === 'preparacion-examen' && (
        <div className="container-d2v2 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">📚</div>
            <h1 className="text-4xl font-bold mb-4">
              Preparación de Examen
            </h1>
            <p className="text-xl text-d2v2-neutral-700 mb-8">
              Próximamente disponible
            </p>
            <button
              onClick={() => setVistaActual('dashboard')}
              className="btn-primary"
            >
              ⬅️ Volver al inicio
            </button>
          </div>
        </div>
      )}

      {/* Progreso */}
      {vistaActual === 'progreso' && (
        <Progreso onVolver={() => setVistaActual('dashboard')} />
      )}
    </div>
  );
}

export default App;
