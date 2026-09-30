import express from 'express';
import dotenv from 'dotenv';
import { TUTOR_SYSTEM_PROMPT } from './config/tutorPrompt';

dotenv.config();

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
app.post('/api/tutor/interaccion', (req, res) => {
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
    MODO: ${modo} ${temaExamen ? `(Temática de Examen: \${temaExamen})` : ''}
    ENTRADA DE PANTALLA: "${entradaUsuario || 'Sesión Iniciada'}"
    `;

    const promptCompleto = `${TUTOR_SYSTEM_PROMPT}\n${contextoInyectado}`;

    res.json({
        aplicacion: "D2V2 AI Engine",
        estado: "Payload estructurado y listo para el pipeline de LLM",
        vistaPreviaPrompt: promptCompleto.substring(0, 380) + "..."
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Motor de D2V2 escuchando peticiones en http://localhost:${PORT}`);
});
