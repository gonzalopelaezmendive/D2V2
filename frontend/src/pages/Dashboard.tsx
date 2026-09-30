import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface DashboardProps {
  nombre: string;
  onIniciarEjercicios: () => void;
  onIniciarExamen: () => void;
  onVerProgreso: () => void;
}

export const Dashboard = ({
  nombre,
  onIniciarEjercicios,
  onIniciarExamen,
  onVerProgreso,
}: DashboardProps) => {
  return (
    <div className="container-d2v2 min-h-screen">
      {/* Header con saludo */}
      <header className="py-12">
        <h1 className="text-5xl font-bold text-d2v2-primary mb-4">
          ¡Hola {nombre}! 👋
        </h1>
        <p className="text-xl text-d2v2-neutral-700 leading-loose">
          ¿Qué quieres hacer hoy?
        </p>
      </header>

      {/* Opciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Ejercicios diarios */}
        <Card emoji="💪" title="Práctica Diaria">
          <p className="text-lg leading-loose mb-6">
            Ejercicios cortos y divertidos para mejorar cada día.
          </p>
          <Button
            variant="primary"
            emoji="🚀"
            size="lg"
            className="w-full"
            onClick={onIniciarEjercicios}
          >
            Empezar ejercicios
          </Button>
        </Card>

        {/* Preparación de examen */}
        <Card emoji="📚" title="Estudiar para Examen">
          <p className="text-lg leading-loose mb-6">
            Prepárate para tu próxima evaluación con ayuda personalizada.
          </p>
          <Button
            variant="secondary"
            emoji="📝"
            size="lg"
            className="w-full"
            onClick={onIniciarExamen}
          >
            Preparar examen
          </Button>
        </Card>
      </div>

      {/* Sección secundaria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mi progreso */}
        <Card emoji="📊">
          <h3 className="text-xl font-bold mb-4">Mi Progreso</h3>
          <p className="text-d2v2-neutral-700 mb-4">
            Ve cómo has mejorado
          </p>
          <Button
            variant="success"
            size="sm"
            className="w-full"
            onClick={onVerProgreso}
          >
            Ver estadísticas
          </Button>
        </Card>

        {/* Racha actual */}
        <Card emoji="🔥">
          <h3 className="text-xl font-bold mb-4">Racha</h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-d2v2-warning mb-2">
              3
            </div>
            <p className="text-d2v2-neutral-700">
              días seguidos
            </p>
          </div>
        </Card>

        {/* Último logro */}
        <Card emoji="🏆">
          <h3 className="text-xl font-bold mb-4">Último Logro</h3>
          <div className="bg-d2v2-success/10 rounded-xl p-4 border-2 border-d2v2-success">
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-d2v2-success">
                ¡10 ejercicios completados!
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tips del día */}
      <div className="mt-12">
        <Card emoji="💡" title="Tip del Día">
          <p className="text-lg leading-loose">
            <strong>Recuerda:</strong> No importa la velocidad, lo importante
            es que sigas avanzando. ¡Cada pequeño paso cuenta! 🌟
          </p>
        </Card>
      </div>
    </div>
  );
};
