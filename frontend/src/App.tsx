import { useState } from 'react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/Input';

function App() {
  const [nombre, setNombre] = useState('');

  return (
    <div className="container-d2v2 min-h-screen">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-6xl font-bold text-d2v2-primary mb-4">
          🚀 NexoMind
        </h1>
        <p className="text-xl text-d2v2-neutral-700 leading-loose max-w-3xl mx-auto">
          Tu espacio personalizado para aprender de forma diferente
        </p>
      </header>

      {/* Demo de Componentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Tarjeta de Bienvenida */}
        <Card emoji="👋" title="¡Bienvenido!">
          <p className="text-lg leading-loose">
            Este es un espacio diseñado <strong>para ti</strong>.
          </p>
          <p className="text-lg leading-loose">
            Aprende a tu ritmo con herramientas que se adaptan
            a tu forma de pensar.
          </p>
        </Card>

        {/* Tarjeta de Registro */}
        <Card emoji="✏️" title="Prueba el Input">
          <div className="space-y-4">
            <p className="text-lg leading-loose">
              Los inputs tienen espaciado generoso y bordes claros.
            </p>
            <Input
              label="¿Cómo te llamas?"
              emoji="👤"
              placeholder="Escribe tu nombre aquí"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {nombre && (
              <p className="text-lg text-d2v2-success font-bold">
                ¡Hola {nombre}! 👋
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Botones de Ejemplo */}
      <Card emoji="🎨" title="Componentes Interactivos">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" emoji="🚀" size="lg">
            Primario
          </Button>
          <Button variant="secondary" emoji="⭐" size="lg">
            Secundario
          </Button>
          <Button variant="success" emoji="✅" size="lg">
            Éxito
          </Button>
          <Button variant="warning" emoji="⚠️" size="lg">
            Advertencia
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-bold">Diseñado para potenciar tu aprendizaje:</h3>
          <ul className="space-y-3 text-lg leading-loose">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <span>
                <strong>Claridad visual:</strong> Textos cortos y espaciados
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔤</span>
              <span>
                <strong>Letras grandes:</strong> Fáciles de seguir y leer
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <span>
                <strong>Emojis guía:</strong> Para saber dónde estás
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌈</span>
              <span>
                <strong>Colores vibrantes:</strong> Distingue cada sección
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">💫</span>
              <span>
                <strong>Respuesta inmediata:</strong> Ves lo que haces
              </span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Footer */}
      <footer className="text-center py-12 text-d2v2-neutral-600">
        <p className="text-lg">
          🤖 Construido con React + Vite + Tailwind CSS
        </p>
        <p className="text-base mt-2">
          Backend: Express + PostgreSQL + Prisma + Claude AI
        </p>
      </footer>
    </div>
  );
}

export default App;
