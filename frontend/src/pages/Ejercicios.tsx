import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTracking } from '../hooks/useTracking';

// Ejercicio de ejemplo con opción múltiple
interface EjercicioData {
  id: string;
  tipo: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  pista: string;
  emoji: string;
}

const ejerciciosEjemplo: EjercicioData[] = [
  {
    id: '1',
    tipo: 'rimas',
    pregunta: '¿Qué palabra rima con "gato"?',
    opciones: ['pato', 'perro', 'casa'],
    respuestaCorrecta: 0,
    pista: 'Piensa en un animal que nada',
    emoji: '🐱',
  },
  {
    id: '2',
    tipo: 'silabas',
    pregunta: '¿Cuántas sílabas tiene "mariposa"?',
    opciones: ['2', '3', '4'],
    respuestaCorrecta: 2,
    pista: 'Separa la palabra: ma-ri-po-sa',
    emoji: '🦋',
  },
  {
    id: '3',
    tipo: 'reconocimiento',
    pregunta: '¿Qué letra falta? "C_SA"',
    opciones: ['A', 'O', 'I'],
    respuestaCorrecta: 0,
    pista: 'Es un lugar donde vives',
    emoji: '🏠',
  },
];

export const Ejercicios = ({ onFinalizar }: { onFinalizar: () => void }) => {
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [puntos, setPuntos] = useState(0);

  const { iniciarEjercicio, registrarIntento, registrarPista, obtenerDatosTracking } = useTracking();

  const ejercicio = ejerciciosEjemplo[ejercicioActual];
  const esUltimoEjercicio = ejercicioActual === ejerciciosEjemplo.length - 1;

  // Iniciar tracking al cargar
  useState(() => {
    iniciarEjercicio();
  });

  const handleSeleccion = (index: number) => {
    if (mostrarResultado) return;
    setRespuestaSeleccionada(index);
  };

  const handleVerificar = () => {
    if (respuestaSeleccionada === null) return;

    registrarIntento();
    setMostrarResultado(true);

    if (respuestaSeleccionada === ejercicio.respuestaCorrecta) {
      setPuntos(prev => prev + (mostrarPista ? 5 : 10));
    }

    const datos = obtenerDatosTracking();
    console.log('Tracking:', datos);
  };

  const handleSiguiente = () => {
    if (esUltimoEjercicio) {
      onFinalizar();
    } else {
      setEjercicioActual(prev => prev + 1);
      setRespuestaSeleccionada(null);
      setMostrarResultado(false);
      setMostrarPista(false);
      iniciarEjercicio();
    }
  };

  const handleMostrarPista = () => {
    setMostrarPista(true);
    registrarPista(ejercicio.pista);
  };

  const esCorrecta = respuestaSeleccionada === ejercicio.respuestaCorrecta;

  return (
    <div className="container-d2v2 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">
              Ejercicio {ejercicioActual + 1} de {ejerciciosEjemplo.length}
            </span>
            <span className="text-lg font-bold text-d2v2-warning">
              ⭐ {puntos} puntos
            </span>
          </div>
          <div className="w-full h-4 bg-d2v2-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-d2v2-primary transition-all duration-500"
              style={{
                width: `${((ejercicioActual + 1) / ejerciciosEjemplo.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card emoji={ejercicio.emoji} title="">
          <div className="space-y-6">
            {/* Pregunta */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 leading-relaxed">
                {ejercicio.pregunta}
              </h2>
            </div>

            {/* Opciones */}
            <div className="space-y-4">
              {ejercicio.opciones.map((opcion, index) => {
                let claseBoton = 'border-2 border-d2v2-neutral-300 hover:border-d2v2-primary';

                if (mostrarResultado) {
                  if (index === ejercicio.respuestaCorrecta) {
                    claseBoton = 'border-2 border-d2v2-success bg-d2v2-success/20';
                  } else if (index === respuestaSeleccionada && !esCorrecta) {
                    claseBoton = 'border-2 border-d2v2-error bg-d2v2-error/20';
                  }
                } else if (index === respuestaSeleccionada) {
                  claseBoton = 'border-2 border-d2v2-primary bg-d2v2-primary/10';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSeleccion(index)}
                    className={`w-full p-6 rounded-xl text-xl font-bold transition-all ${claseBoton}`}
                    disabled={mostrarResultado}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>

            {/* Pista */}
            {!mostrarResultado && (
              <div className="text-center">
                {mostrarPista ? (
                  <div className="bg-d2v2-warning/10 border-2 border-d2v2-warning rounded-xl p-4">
                    <p className="text-lg">
                      <strong>💡 Pista:</strong> {ejercicio.pista}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="warning"
                    emoji="💡"
                    size="md"
                    onClick={handleMostrarPista}
                  >
                    Ver pista
                  </Button>
                )}
              </div>
            )}

            {/* Resultado */}
            {mostrarResultado && (
              <div
                className={`rounded-xl p-6 text-center ${
                  esCorrecta
                    ? 'bg-d2v2-success/20 border-2 border-d2v2-success'
                    : 'bg-d2v2-warning/20 border-2 border-d2v2-warning'
                }`}
              >
                <div className="text-5xl mb-4">
                  {esCorrecta ? '🎉' : '💪'}
                </div>
                <p className="text-2xl font-bold mb-2">
                  {esCorrecta ? '¡Excelente!' : '¡Casi!'}
                </p>
                <p className="text-lg">
                  {esCorrecta
                    ? `Ganaste ${mostrarPista ? '5' : '10'} puntos`
                    : 'Sigue intentando, vas muy bien'}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4">
              {!mostrarResultado ? (
                <Button
                  variant="success"
                  emoji="✓"
                  size="lg"
                  className="w-full"
                  onClick={handleVerificar}
                  disabled={respuestaSeleccionada === null}
                >
                  Verificar
                </Button>
              ) : (
                <Button
                  variant="primary"
                  emoji={esUltimoEjercicio ? '🏁' : '➡️'}
                  size="lg"
                  className="w-full"
                  onClick={handleSiguiente}
                >
                  {esUltimoEjercicio ? 'Finalizar' : 'Siguiente'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
