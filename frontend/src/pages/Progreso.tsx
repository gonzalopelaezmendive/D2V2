import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Progreso = ({ onVolver }: { onVolver: () => void }) => {
  // Datos de ejemplo (más adelante vendrán del backend)
  const estadisticas = {
    ejerciciosCompletados: 47,
    tasaAcierto: 0.85,
    rachaActual: 5,
    tiempoPromedio: 12,
    mejorRacha: 12,
  };

  const progresoPorTipo = [
    { tipo: 'Rimas', emoji: '🎵', completados: 15, total: 20, porcentaje: 75 },
    { tipo: 'Sílabas', emoji: '✂️', completados: 12, total: 20, porcentaje: 60 },
    { tipo: 'Reconocimiento', emoji: '👁️', completados: 20, total: 20, porcentaje: 100 },
  ];

  const logros = [
    { emoji: '🔥', titulo: '5 días seguidos', desbloqueado: true },
    { emoji: '⭐', titulo: '50 ejercicios', desbloqueado: false },
    { emoji: '🎯', titulo: '90% de aciertos', desbloqueado: true },
    { emoji: '🏆', titulo: '100 ejercicios', desbloqueado: false },
  ];

  return (
    <div className="container-d2v2 min-h-screen">
      <header className="py-12">
        <Button
          variant="secondary"
          emoji="⬅️"
          size="sm"
          onClick={onVolver}
        >
          Volver
        </Button>

        <h1 className="text-5xl font-bold text-d2v2-primary mt-6 mb-4">
          Tu Progreso 📊
        </h1>
        <p className="text-xl text-d2v2-neutral-700 leading-loose">
          Mira todo lo que has logrado
        </p>
      </header>

      {/* Resumen general */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card emoji="✅">
          <div className="text-center">
            <div className="text-4xl font-bold text-d2v2-primary mb-2">
              {estadisticas.ejerciciosCompletados}
            </div>
            <div className="text-d2v2-neutral-700">
              Ejercicios completados
            </div>
          </div>
        </Card>

        <Card emoji="🎯">
          <div className="text-center">
            <div className="text-4xl font-bold text-d2v2-success mb-2">
              {Math.round(estadisticas.tasaAcierto * 100)}%
            </div>
            <div className="text-d2v2-neutral-700">
              Tasa de acierto
            </div>
          </div>
        </Card>

        <Card emoji="🔥">
          <div className="text-center">
            <div className="text-4xl font-bold text-d2v2-warning mb-2">
              {estadisticas.rachaActual}
            </div>
            <div className="text-d2v2-neutral-700">
              Racha actual
            </div>
          </div>
        </Card>

        <Card emoji="⏱️">
          <div className="text-center">
            <div className="text-4xl font-bold text-d2v2-secondary mb-2">
              {estadisticas.tiempoPromedio}s
            </div>
            <div className="text-d2v2-neutral-700">
              Tiempo promedio
            </div>
          </div>
        </Card>
      </div>

      {/* Progreso por tipo de ejercicio */}
      <Card emoji="📈" title="Progreso por Tipo">
        <div className="space-y-6">
          {progresoPorTipo.map((item) => (
            <div key={item.tipo}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  {item.tipo}
                </span>
                <span className="text-lg font-bold text-d2v2-primary">
                  {item.completados}/{item.total}
                </span>
              </div>
              <div className="w-full h-6 bg-d2v2-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-d2v2-primary transition-all duration-500"
                  style={{ width: `${item.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Logros */}
      <div className="mt-12">
        <Card emoji="🏆" title="Tus Logros">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {logros.map((logro, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  logro.desbloqueado
                    ? 'border-d2v2-success bg-d2v2-success/10'
                    : 'border-d2v2-neutral-300 opacity-50'
                }`}
              >
                <div className="text-5xl mb-3">{logro.emoji}</div>
                <div className="font-bold text-sm">{logro.titulo}</div>
                {logro.desbloqueado && (
                  <div className="text-d2v2-success text-xs mt-2">
                    ✓ Desbloqueado
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mensaje motivacional */}
      <div className="mt-12">
        <Card emoji="💪">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">¡Vas increíble!</h3>
            <p className="text-lg leading-loose text-d2v2-neutral-700">
              Has mejorado tu velocidad en un <strong className="text-d2v2-success">15%</strong> este mes.
              Sigue así y pronto alcanzarás tu mejor racha de <strong>{estadisticas.mejorRacha} días</strong>! 🚀
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
