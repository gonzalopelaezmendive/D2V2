import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface DashboardPadresProps {
  nombre: string;
  onCerrarSesion: () => void;
}

export const DashboardPadres = ({ nombre, onCerrarSesion }: DashboardPadresProps) => {
  // Datos de ejemplo (más adelante vendrán del backend)
  const hijosSupervisados = [
    {
      id: '1',
      nombre: 'Juan',
      edad: 10,
      ultimaSesion: '2026-09-29',
      ejerciciosCompletados: 47,
      tasaAcierto: 0.85,
      rachaActual: 5,
    },
    {
      id: '2',
      nombre: 'María',
      edad: 12,
      ultimaSesion: '2026-09-28',
      ejerciciosCompletados: 62,
      tasaAcierto: 0.92,
      rachaActual: 8,
    },
  ];

  return (
    <div className="container-d2v2 min-h-screen">
      <header className="py-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-d2v2-secondary mb-4">
              👨‍👩‍👧‍👦 Panel de Supervisión
            </h1>
            <p className="text-xl text-d2v2-neutral-700 leading-loose">
              Bienvenido/a, <strong>{nombre}</strong>
            </p>
          </div>
          <Button
            variant="secondary"
            emoji="🚪"
            size="md"
            onClick={onCerrarSesion}
          >
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Resumen de hijos supervisados */}
      <Card emoji="👧👦" title="Estudiantes bajo tu supervisión">
        <div className="space-y-6">
          {hijosSupervisados.map((hijo) => (
            <div
              key={hijo.id}
              className="p-6 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary transition-all bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{hijo.nombre}</h3>
                  <p className="text-d2v2-neutral-700">
                    {hijo.edad} años • Última sesión: {hijo.ultimaSesion}
                  </p>
                </div>
                <Button
                  variant="primary"
                  emoji="📊"
                  size="sm"
                  onClick={() => alert(`Ver progreso de ${hijo.nombre}`)}
                >
                  Ver detalles
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-d2v2-primary/10 rounded-xl">
                  <div className="text-3xl font-bold text-d2v2-primary mb-1">
                    {hijo.ejerciciosCompletados}
                  </div>
                  <div className="text-sm text-d2v2-neutral-700">
                    Ejercicios completados
                  </div>
                </div>

                <div className="text-center p-4 bg-d2v2-success/10 rounded-xl">
                  <div className="text-3xl font-bold text-d2v2-success mb-1">
                    {Math.round(hijo.tasaAcierto * 100)}%
                  </div>
                  <div className="text-sm text-d2v2-neutral-700">
                    Tasa de acierto
                  </div>
                </div>

                <div className="text-center p-4 bg-d2v2-warning/10 rounded-xl">
                  <div className="text-3xl font-bold text-d2v2-warning mb-1">
                    {hijo.rachaActual}
                  </div>
                  <div className="text-sm text-d2v2-neutral-700">
                    Racha de días
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Acciones rápidas */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card emoji="✅" title="Gestionar Permisos">
          <p className="text-lg leading-loose text-d2v2-neutral-700 mb-6">
            Aprueba o revoca el acceso de tus hijos a la plataforma
          </p>
          <Button
            variant="primary"
            emoji="🔑"
            size="lg"
            className="w-full"
            onClick={() => alert('Gestión de permisos - próximamente')}
          >
            Gestionar permisos
          </Button>
        </Card>

        <Card emoji="📧" title="Reportes por Email">
          <p className="text-lg leading-loose text-d2v2-neutral-700 mb-6">
            Recibe reportes semanales del progreso directamente en tu correo
          </p>
          <Button
            variant="success"
            emoji="✉️"
            size="lg"
            className="w-full"
            onClick={() => alert('Configurar reportes - próximamente')}
          >
            Configurar reportes
          </Button>
        </Card>
      </div>

      {/* Información legal */}
      <div className="mt-12">
        <Card emoji="ℹ️" title="Información sobre el Consentimiento Parental">
          <div className="space-y-4 text-lg leading-loose text-d2v2-neutral-700">
            <p>
              <strong>COPPA y GDPR:</strong> Como padre/tutor, tu consentimiento
              es necesario para que los menores de 13 años usen esta plataforma.
            </p>
            <p>
              <strong>Tus derechos:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Revisar los datos recopilados de tus hijos</li>
              <li>Solicitar la eliminación de datos en cualquier momento</li>
              <li>Revocar el consentimiento y bloquear el acceso</li>
              <li>Acceder a reportes detallados de actividad</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <Button
                variant="secondary"
                emoji="📄"
                size="md"
                onClick={() => window.open('/terminos', '_blank')}
              >
                Leer Términos
              </Button>
              <Button
                variant="secondary"
                emoji="🔒"
                size="md"
                onClick={() => window.open('/privacidad', '_blank')}
              >
                Política de Privacidad
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
