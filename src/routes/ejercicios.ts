import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../lib/prisma.js';

const router = Router();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generar ejercicios dinámicamente con Claude
 */
router.post('/generar', async (req, res) => {
    try {
        const { usuarioId, tipo, nivelDificultad = 1, cantidad = 3 } = req.body;

        if (!usuarioId) {
            return res.status(400).json({ error: 'usuarioId requerido' });
        }

        // Obtener perfil del usuario
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const perfilClinico = usuario.perfilClinico as any;

        // Crear o recuperar sesión activa
        let sesion = await prisma.sesion.findFirst({
            where: {
                usuarioId,
                fechaFin: null,
            },
        });

        if (!sesion) {
            sesion = await prisma.sesion.create({
                data: {
                    usuarioId,
                    modo: 'ejercicios_diarios',
                },
            });
        }

        // Prompt para generar ejercicios
        const promptGeneracion = `
Eres un generador de ejercicios para apoyo a estudiantes con dislexia.

PERFIL DEL ESTUDIANTE:
- Edad: ${usuario.edad} años
- Tipo de dislexia: ${perfilClinico.tipo_dislexia || 'fonológica'}
- Nivel de severidad: ${perfilClinico.nivel_severidad || 'moderado'}
- Grafemas conflictivos: ${perfilClinico.grafemas_conflictivos?.join(', ') || 'b-d, p-q'}
- Velocidad de lectura: ${perfilClinico.velocidad_lectura_wpm || 60} palabras por minuto

INSTRUCCIONES:
Genera ${cantidad} ejercicios de tipo "${tipo || 'mixto'}" con nivel de dificultad ${nivelDificultad} (escala 1-5).

Tipos de ejercicios disponibles:
- "rimas": Identificar palabras que riman
- "silabas": Contar o separar sílabas
- "reconocimiento": Reconocimiento visual de letras/palabras
- "lectura": Comprensión lectora adaptada
- "mixto": Combinar varios tipos

FORMATO DE SALIDA (JSON estricto):
{
  "ejercicios": [
    {
      "tipo": "rimas",
      "pregunta": "¿Qué palabra rima con 'gato'?",
      "opciones": ["pato", "perro", "casa"],
      "respuestaCorrecta": 0,
      "pista": "Piensa en un animal que nada",
      "emoji": "🐱"
    }
  ]
}

IMPORTANTE:
- Adapta el lenguaje a la edad del estudiante
- Usa frases cortas (máximo 12 palabras)
- Evita los grafemas conflictivos del estudiante en niveles 1-2
- Incluye un emoji representativo para cada ejercicio
- La respuestaCorrecta es el índice (0, 1, 2...) de la opción correcta
- SOLO devuelve el JSON, sin texto adicional
`;

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: promptGeneracion,
                },
            ],
        });

        const respuestaText = message.content[0]?.type === 'text'
            ? message.content[0].text
            : '';

        // Parsear JSON de la respuesta
        let ejerciciosGenerados;
        try {
            // Extraer JSON si está envuelto en markdown code blocks
            const jsonMatch = respuestaText.match(/```json\n?([\s\S]*?)\n?```/) ||
                             respuestaText.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : respuestaText;
            ejerciciosGenerados = JSON.parse(jsonText);
        } catch (error) {
            console.error('Error parsing JSON:', respuestaText);
            return res.status(500).json({
                error: 'Error al generar ejercicios',
                detalle: 'La IA no devolvió un formato JSON válido',
            });
        }

        // Guardar ejercicios en la base de datos
        const ejerciciosGuardados = [];
        for (const ejercicioData of ejerciciosGenerados.ejercicios || []) {
            const ejercicio = await prisma.ejercicio.create({
                data: {
                    sesionId: sesion.id,
                    tipo: ejercicioData.tipo,
                    nivelDificultad,
                    contenido: ejercicioData,
                },
            });
            ejerciciosGuardados.push(ejercicio);
        }

        res.json({
            mensaje: 'Ejercicios generados con éxito',
            sesionId: sesion.id,
            ejercicios: ejerciciosGuardados,
        });
    } catch (error: any) {
        console.error('Error generando ejercicios:', error);
        res.status(500).json({
            error: 'Error al generar ejercicios',
            detalle: error.message,
        });
    }
});

export default router;
