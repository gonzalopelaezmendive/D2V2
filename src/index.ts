import express from 'express';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { TUTOR_SYSTEM_PROMPT } from './config/tutorPrompt.js';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Almacenamiento seguro temporal en memoria para la fase inicial de D2V2
const usuariosD2V2: Record<string, any> = {};

/**
 * ENDPOINT 1: Ingesta y Procesamiento de Diagnóstico para D2V2
 */
app.post('/api/usuarios/registro', (req, res) => {
    const { nombre, edad, correo, perfilClinico } = req.body;

    if (!nombre || !edad || !perfilClinico) {
         res.status(400).json({ error: "Faltan variables críticas para la personalización de D2V2." });
         return;
    }

    const usuarioId = `d2v2_usr_${Date.now()}`;
    usuariosD2V2[usuarioId] = {
        nombre,
        edad,
        correo,
        perfilClinico,
        progreso: { nivel: 1, racha: 0 }
    };

    res.status(201).json({
        mensaje: "Perfil Clínico integrado con éxito al ecosistema de D2V2.",
        usuarioId,
        estrategiaAplicada: `Motor adaptativo listo para dislexia de tipo: ${perfilClinico.tipo_dislexia}`
    });
});

/**
 * ENDPOINT 2: Orquestador de Interacción de Agentes
 */
app.post('/api/tutor/interaccion', async (req, res) => {
    const { usuarioId, modo, temaExamen, entradaUsuario } = req.body;
    const usuario = usuariosD2V2[usuarioId];

    if (!usuario) {
         res.status(404).json({ error: "Usuario no registrado en la base de D2V2." });
         return;
    }

    const contextoInyectado = `
    --- CONTEXTO OPERATIVO D2V2 ---
    EDAD: ${usuario.edad} años.
    PERFIL CLÍNICO DEL USUARIO: ${JSON.stringify(usuario.perfilClinico)}
    MODO: ${modo} ${temaExamen ? `(Temática de Examen: ${temaExamen})` : ''}
    ENTRADA DE PANTALLA: "${entradaUsuario || 'Sesión Iniciada'}"
    `;

    try {
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

        res.json({
            aplicacion: "D2V2 AI Engine",
            estado: "Respuesta generada con éxito",
            usuarioId,
            respuesta: respuestaTutor
        });
    } catch (error: any) {
        console.error('Error al comunicarse con Anthropic:', error);
        res.status(500).json({
            error: "Error al generar respuesta del tutor",
            detalle: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Motor de D2V2 escuchando peticiones en http://localhost:${PORT}`);
});
