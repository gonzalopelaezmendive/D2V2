import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface ConsentimientoProps {
  nombreMenor: string;
  edadMenor: number;
  onAprobar: () => void;
  onRechazar: () => void;
}

export const ConsentimientoParental = ({
  nombreMenor,
  edadMenor,
  onAprobar,
  onRechazar,
}: ConsentimientoProps) => {
  const [paso, setPaso] = useState(1);
  const [nombreTutor, setNombreTutor] = useState('');
  const [relacionTutor, setRelacionTutor] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaMonitoreo, setAceptaMonitoreo] = useState(false);

  const puedeAprobar = nombreTutor && relacionTutor && aceptaTerminos && aceptaPrivacidad && aceptaMonitoreo;

  return (
    <div className="container-d2v2 min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-3xl">
        {/* Paso 1: Información */}
        {paso === 1 && (
          <Card emoji="👨‍👩‍👧‍👦" title="Consentimiento Parental Requerido">
            <div className="space-y-6">
              <div className="bg-d2v2-primary/10 border-2 border-d2v2-primary rounded-xl p-6">
                <p className="text-lg leading-loose">
                  <strong>{nombreMenor}</strong> ({edadMenor} años) quiere usar NexoMind.
                </p>
                <p className="text-lg leading-loose mt-4">
                  Como tutor legal, necesitamos tu autorización para que pueda acceder
                  a la plataforma de forma segura.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">¿Por qué pedimos esto?</h3>
                <ul className="space-y-3 text-lg leading-loose">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <span>
                      <strong>Cumplimiento legal:</strong> COPPA y GDPR requieren
                      consentimiento parental para menores de 13 años
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👁️</span>
                    <span>
                      <strong>Supervisión:</strong> Podrás monitorear su progreso
                      y actividad en cualquier momento
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🛡️</span>
                    <span>
                      <strong>Seguridad:</strong> Protegemos los datos de tu hijo/a
                      con encriptación de nivel bancario
                    </span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                emoji="➡️"
                size="lg"
                className="w-full"
                onClick={() => setPaso(2)}
              >
                Continuar
              </Button>

              <button
                onClick={onRechazar}
                className="w-full text-d2v2-neutral-600 hover:text-d2v2-neutral-800 underline"
              >
                Cancelar
              </button>
            </div>
          </Card>
        )}

        {/* Paso 2: Verificación de tutor */}
        {paso === 2 && (
          <Card emoji="✍️" title="Información del Tutor">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-2">
                  <span className="text-2xl">👤</span>
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  className="input-d2v2"
                  placeholder="Nombre y apellido"
                  value={nombreTutor}
                  onChange={(e) => setNombreTutor(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-bold mb-2">
                  <span className="text-2xl">🤝</span>
                  Relación con {nombreMenor}
                </label>
                <select
                  className="input-d2v2"
                  value={relacionTutor}
                  onChange={(e) => setRelacionTutor(e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="tutor_legal">Tutor legal</option>
                  <option value="abuelo">Abuelo/a</option>
                  <option value="otro">Otro familiar</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Términos y condiciones</h3>

                <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 w-5 h-5 text-d2v2-primary"
                  />
                  <span className="text-lg leading-loose">
                    He leído y acepto los <strong>Términos de Servicio</strong>
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={aceptaPrivacidad}
                    onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                    className="mt-1 w-5 h-5 text-d2v2-primary"
                  />
                  <span className="text-lg leading-loose">
                    Acepto la <strong>Política de Privacidad</strong> y el
                    tratamiento de datos de mi hijo/a
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-d2v2-neutral-300 hover:border-d2v2-primary cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={aceptaMonitoreo}
                    onChange={(e) => setAceptaMonitoreo(e.target.checked)}
                    className="mt-1 w-5 h-5 text-d2v2-primary"
                  />
                  <span className="text-lg leading-loose">
                    Autorizo el <strong>monitoreo del progreso</strong> y
                    acepto recibir reportes periódicos
                  </span>
                </label>
              </div>

              {puedeAprobar && (
                <div className="bg-d2v2-success/10 border-2 border-d2v2-success rounded-xl p-4">
                  <p className="text-lg leading-loose text-center">
                    <strong>✅ Todo listo.</strong> Al aprobar, {nombreMenor} podrá
                    usar NexoMind bajo tu supervisión.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  emoji="⬅️"
                  size="lg"
                  className="flex-1"
                  onClick={() => setPaso(1)}
                >
                  Atrás
                </Button>

                <Button
                  variant="success"
                  emoji="✓"
                  size="lg"
                  className="flex-1"
                  onClick={onAprobar}
                  disabled={!puedeAprobar}
                >
                  Aprobar acceso
                </Button>
              </div>

              <button
                onClick={onRechazar}
                className="w-full text-d2v2-neutral-600 hover:text-d2v2-neutral-800 underline"
              >
                Cancelar
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
