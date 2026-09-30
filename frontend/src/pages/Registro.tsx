import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { usuariosApi } from '../lib/api';
import type { PerfilClinico } from '../types';

export const Registro = ({ onRegistroExitoso }: { onRegistroExitoso: (usuarioId: string) => void }) => {
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDislexia, setTipoDislexia] = useState<'fonologica' | 'superficial' | 'mixta'>('fonologica');
  const [grafemas, setGrafemas] = useState<string[]>([]);

  const grafemasComunesOptions = [
    { valor: 'b/d', label: 'b y d', emoji: '🔤' },
    { valor: 'p/q', label: 'p y q', emoji: '🔄' },
    { valor: 'm/n', label: 'm y n', emoji: '✏️' },
    { valor: 'u/n', label: 'u y n', emoji: '📝' },
  ];

  const toggleGrafema = (grafema: string) => {
    setGrafemas(prev =>
      prev.includes(grafema)
        ? prev.filter(g => g !== grafema)
        : [...prev, grafema]
    );
  };

  const handleRegistro = async () => {
    setError('');
    setLoading(true);

    try {
      const perfilClinico: PerfilClinico = {
        tipo_dislexia: tipoDislexia,
        grafemas_conflictivos: grafemas,
      };

      const response = await usuariosApi.registrar({
        nombre,
        edad: parseInt(edad),
        correo: correo || undefined,
        perfilClinico,
      });

      onRegistroExitoso(response.usuarioId);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-d2v2 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Paso 1: Información básica */}
        {paso === 1 && (
          <Card emoji="👋" title="¡Hola! Vamos a conocernos">
            <div className="space-y-6">
              <p className="text-lg leading-loose">
                Cuéntanos un poco sobre ti para personalizar tu experiencia.
              </p>

              <Input
                label="¿Cómo te llamas?"
                emoji="😊"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <Input
                label="¿Cuántos años tienes?"
                emoji="🎂"
                type="number"
                placeholder="Tu edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
              />

              <Input
                label="Email (opcional)"
                emoji="📧"
                type="email"
                placeholder="tu@email.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />

              <Button
                variant="primary"
                emoji="➡️"
                size="lg"
                className="w-full"
                onClick={() => setPaso(2)}
                disabled={!nombre || !edad}
              >
                Siguiente
              </Button>
            </div>
          </Card>
        )}

        {/* Paso 2: Configuración de aprendizaje */}
        {paso === 2 && (
          <Card emoji="🎯" title="Personaliza tu experiencia">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-4">
                  <span className="text-2xl">💡</span>
                  ¿Qué se te hace más difícil?
                </label>

                <div className="space-y-3">
                  <button
                    onClick={() => setTipoDislexia('fonologica')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      tipoDislexia === 'fonologica'
                        ? 'border-d2v2-primary bg-d2v2-primary/10'
                        : 'border-d2v2-neutral-300 hover:border-d2v2-primary/50'
                    }`}
                  >
                    <div className="font-bold text-lg">🔊 Sonidos y pronunciación</div>
                    <div className="text-d2v2-neutral-700 mt-1">
                      Separar palabras en sílabas, rimas
                    </div>
                  </button>

                  <button
                    onClick={() => setTipoDislexia('superficial')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      tipoDislexia === 'superficial'
                        ? 'border-d2v2-primary bg-d2v2-primary/10'
                        : 'border-d2v2-neutral-300 hover:border-d2v2-primary/50'
                    }`}
                  >
                    <div className="font-bold text-lg">👁️ Reconocer palabras completas</div>
                    <div className="text-d2v2-neutral-700 mt-1">
                      Ver la palabra como imagen
                    </div>
                  </button>

                  <button
                    onClick={() => setTipoDislexia('mixta')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      tipoDislexia === 'mixta'
                        ? 'border-d2v2-primary bg-d2v2-primary/10'
                        : 'border-d2v2-neutral-300 hover:border-d2v2-primary/50'
                    }`}
                  >
                    <div className="font-bold text-lg">🔄 Ambos</div>
                    <div className="text-d2v2-neutral-700 mt-1">
                      Un poco de cada uno
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-4">
                  <span className="text-2xl">🔤</span>
                  ¿Qué letras te confunden? (opcional)
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {grafemasComunesOptions.map((opcion) => (
                    <button
                      key={opcion.valor}
                      onClick={() => toggleGrafema(opcion.valor)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        grafemas.includes(opcion.valor)
                          ? 'border-d2v2-success bg-d2v2-success/10'
                          : 'border-d2v2-neutral-300 hover:border-d2v2-success/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opcion.emoji}</div>
                      <div className="font-bold">{opcion.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-d2v2-error/10 border-2 border-d2v2-error rounded-xl p-4">
                  <p className="text-d2v2-error font-bold">⚠️ {error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  emoji="⬅️"
                  size="lg"
                  className="flex-1"
                  onClick={() => setPaso(1)}
                  disabled={loading}
                >
                  Atrás
                </Button>

                <Button
                  variant="success"
                  emoji="🚀"
                  size="lg"
                  className="flex-1"
                  onClick={handleRegistro}
                  disabled={loading}
                >
                  {loading ? 'Creando...' : '¡Empezar!'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
