import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { TUTOR_SYSTEM_PROMPT } from './config/tutorPrompt.js';
import { prisma } from './lib/prisma.js';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * ENDPOINT 1: Ingesta y Procesamiento de Diagnóstico para D2V2
 */
app.post('/api/usuarios/registro', async (req, res) => {
    const { nombre, edad, correo, perfilClinico } = req.body;

    if (!nombre || !edad || !perfilClinico) {
         res.status(400).json({ error: "Faltan variables críticas para la personalización de D2V2." });
         return;
    }

    try {
        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                edad,
                correo,
                perfilClinico,
            },
        });

        res.status(201).json({
            mensaje: "Perfil Clínico integrado con éxito al ecosistema de D2V2.",
            usuarioId: usuario.id,
            estrategiaAplicada: `Motor adaptativo listo para dislexia de tipo: ${(perfilClinico as any).tipo_dislexia}`
        });
    } catch (error: any) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            error: "Error al registrar usuario",
            detalle: error.message
        });
    }
});

/**
 * ENDPOINT 2: Orquestador de Interacción de Agentes
 */
app.post('/api/tutor/interaccion', async (req, res) => {
    const { usuarioId, modo, temaExamen, entradaUsuario } = req.body;

    try {
        // Buscar usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            res.status(404).json({ error: "Usuario no registrado en la base de D2V2." });
            return;
        }

        // Crear o recuperar sesión activa
        let sesion = await prisma.sesion.findFirst({
            where: {
                usuarioId,
                fechaFin: null, // Sesión aún activa
            },
        });

        if (!sesion) {
            sesion = await prisma.sesion.create({
                data: {
                    usuarioId,
                    modo,
                    temaEstudiado: temaExamen,
                },
            });
        }

        const contextoInyectado = `
    --- CONTEXTO OPERATIVO D2V2 ---
    EDAD: ${usuario.edad} años.
    PERFIL CLÍNICO DEL USUARIO: ${JSON.stringify(usuario.perfilClinico)}
    MODO: ${modo} ${temaExamen ? `(Temática de Examen: ${temaExamen})` : ''}
    ENTRADA DE PANTALLA: "${entradaUsuario || 'Sesión Iniciada'}"
    `;

        // Llamada a la API de Anthropic
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: TUTOR_SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: contextoInyectado
                }
            ]
        });

        const respuestaTutor = message.content[0]?.type === 'text'
            ? message.content[0].text
            : '';

        // Guardar la interacción en la base de datos
        const interaccion = await prisma.interaccion.create({
            data: {
                sesionId: sesion.id,
                contextoInyectado,
                respuestaIA: respuestaTutor,
                tokensUsados: message.usage.input_tokens + message.usage.output_tokens,
            },
        });

        res.json({
            aplicacion: "D2V2 AI Engine",
            estado: "Respuesta generada con éxito",
            usuarioId,
            sesionId: sesion.id,
            interaccionId: interaccion.id,
            respuesta: respuestaTutor
        });
    } catch (error: any) {
        console.error('Error en endpoint de interacción:', error);
        res.status(500).json({
            error: "Error al procesar interacción",
            detalle: error.message
        });
    }
});

/**
 * ENDPOINT 3: Crear ejercicio y registrar intento
 */
app.post('/api/ejercicios/crear', async (req, res) => {
    const { sesionId, tipo, nivelDificultad, contenido } = req.body;

    try {
        const ejercicio = await prisma.ejercicio.create({
            data: {
                sesionId,
                tipo,
                nivelDificultad: nivelDificultad || 1,
                contenido,
            },
        });

        res.status(201).json({
            mensaje: "Ejercicio creado con éxito",
            ejercicioId: ejercicio.id,
            ejercicio,
        });
    } catch (error: any) {
        console.error('Error al crear ejercicio:', error);
        res.status(500).json({
            error: "Error al crear ejercicio",
            detalle: error.message
        });
    }
});

/**
 * ENDPOINT 4: Registrar respuesta de ejercicio
 */
app.post('/api/ejercicios/responder', async (req, res) => {
    const {
        ejercicioId,
        respuestaUsuario,
        esCorrecta,
        intentos,
        pistasUsadas,
        tiempoRespuestaMs,
        estadoEmocional,
    } = req.body;

    try {
        // Registrar la respuesta
        const respuesta = await prisma.respuestaEjercicio.create({
            data: {
                ejercicioId,
                respuestaUsuario,
                esCorrecta,
                intentos: intentos || 1,
                pistasUsadas: pistasUsadas || [],
                tiempoRespuestaMs,
                estadoEmocional,
            },
        });

        // Marcar el ejercicio como finalizado
        await prisma.ejercicio.update({
            where: { id: ejercicioId },
            data: { tiempoFin: new Date() },
        });

        res.status(201).json({
            mensaje: "Respuesta registrada con éxito",
            respuestaId: respuesta.id,
            respuesta,
        });
    } catch (error: any) {
        console.error('Error al registrar respuesta:', error);
        res.status(500).json({
            error: "Error al registrar respuesta",
            detalle: error.message
        });
    }
});

/**
 * ENDPOINT 5: Finalizar sesión
 */
app.post('/api/sesiones/:sesionId/finalizar', async (req, res) => {
    const { sesionId } = req.params;

    try {
        const sesion = await prisma.sesion.update({
            where: { id: sesionId },
            data: { fechaFin: new Date() },
            include: {
                ejercicios: {
                    include: {
                        respuestas: true,
                    },
                },
            },
        });

        // Calcular métricas de la sesión
        const totalEjercicios = sesion.ejercicios.length;
        const ejerciciosCompletados = sesion.ejercicios.filter(e => e.tiempoFin).length;
        const respuestasCorrectas = sesion.ejercicios.flatMap(e => e.respuestas).filter(r => r.esCorrecta).length;
        const totalRespuestas = sesion.ejercicios.flatMap(e => e.respuestas).length;
        const tasaAcierto = totalRespuestas > 0 ? respuestasCorrectas / totalRespuestas : 0;

        res.json({
            mensaje: "Sesión finalizada",
            sesion,
            metricas: {
                totalEjercicios,
                ejerciciosCompletados,
                tasaAcierto: Math.round(tasaAcierto * 100) / 100,
                respuestasCorrectas,
                totalRespuestas,
            },
        });
    } catch (error: any) {
        console.error('Error al finalizar sesión:', error);
        res.status(500).json({
            error: "Error al finalizar sesión",
            detalle: error.message
        });
    }
});

/**
 * ENDPOINT 6: Obtener progreso del usuario
 */
app.get('/api/usuarios/:usuarioId/progreso', async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                sesiones: {
                    include: {
                        ejercicios: {
                            include: {
                                respuestas: true,
                            },
                        },
                    },
                    orderBy: { fechaInicio: 'desc' },
                    take: 10, // Últimas 10 sesiones
                },
                metricasAgregadas: {
                    orderBy: { fecha: 'desc' },
                    take: 30, // Últimos 30 días
                },
            },
        });

        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        res.json({
            usuario,
            estadisticas: {
                totalSesiones: usuario.sesiones.length,
                // Agregar más estadísticas según necesidad
            },
        });
    } catch (error: any) {
        console.error('Error al obtener progreso:', error);
        res.status(500).json({
            error: "Error al obtener progreso del usuario",
            detalle: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Motor de D2V2 escuchando peticiones en http://localhost:${PORT}`);
});
