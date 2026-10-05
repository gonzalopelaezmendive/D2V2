import { Router } from 'express';
import { generateJWT } from '../config/oauth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5178';

/**
 * MOCK OAuth para desarrollo
 * Simula el flujo de OAuth sin necesidad de credenciales reales
 */

// Mock de Google OAuth
router.get('/mock/google', async (req, res) => {
    try {
        const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';

        // Simular datos de usuario de Google
        const mockGoogleUser = {
            oauthProvider: 'google',
            oauthId: `mock-google-${Date.now()}`,
            email: tipoUsuario === 'menor' ? 'estudiante.mock@gmail.com' : 'padre.mock@gmail.com',
            nombre: tipoUsuario === 'menor' ? 'Juan Estudiante' : 'María Tutora',
            avatar: 'https://via.placeholder.com/150',
        };

        // Buscar o crear usuario
        let usuario = await prisma.usuario.findUnique({
            where: { email: mockGoogleUser.email },
        });

        if (!usuario) {
            usuario = await prisma.usuario.create({
                data: {
                    nombre: mockGoogleUser.nombre,
                    email: mockGoogleUser.email,
                    edad: tipoUsuario === 'menor' ? 10 : 35,
                    tipoUsuario,
                    oauthProvider: mockGoogleUser.oauthProvider,
                    oauthId: mockGoogleUser.oauthId,
                    avatar: mockGoogleUser.avatar,
                    perfilClinico: tipoUsuario === 'menor' ? {
                        tipo_dislexia: 'fonologica',
                        nivel_severidad: 'moderado',
                        grafemas_conflictivos: ['b-d', 'p-q'],
                        velocidad_lectura_wpm: 60,
                    } : {},
                    consentimientoParental: tipoUsuario === 'adulto',
                },
            });
        }

        // Generar JWT
        const token = generateJWT(usuario.id, usuario.email, usuario.tipoUsuario as 'menor' | 'adulto');

        // Redirigir con token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${usuario.id}&tipo=${tipoUsuario}`);
    } catch (error) {
        console.error('Error en mock Google OAuth:', error);
        res.redirect(`${FRONTEND_URL}?error=mock_auth_failed`);
    }
});

// Mock de Microsoft OAuth
router.get('/mock/microsoft', async (req, res) => {
    try {
        const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';

        // Simular datos de usuario de Microsoft
        const mockMicrosoftUser = {
            oauthProvider: 'microsoft',
            oauthId: `mock-microsoft-${Date.now()}`,
            email: tipoUsuario === 'menor' ? 'estudiante.mock@outlook.com' : 'padre.mock@outlook.com',
            nombre: tipoUsuario === 'menor' ? 'Ana Estudiante' : 'Pedro Tutor',
            avatar: 'https://via.placeholder.com/150',
        };

        // Buscar o crear usuario
        let usuario = await prisma.usuario.findUnique({
            where: { email: mockMicrosoftUser.email },
        });

        if (!usuario) {
            usuario = await prisma.usuario.create({
                data: {
                    nombre: mockMicrosoftUser.nombre,
                    email: mockMicrosoftUser.email,
                    edad: tipoUsuario === 'menor' ? 12 : 38,
                    tipoUsuario,
                    oauthProvider: mockMicrosoftUser.oauthProvider,
                    oauthId: mockMicrosoftUser.oauthId,
                    avatar: mockMicrosoftUser.avatar,
                    perfilClinico: tipoUsuario === 'menor' ? {
                        tipo_dislexia: 'superficial',
                        nivel_severidad: 'leve',
                        grafemas_conflictivos: ['m-n', 'u-n'],
                        velocidad_lectura_wpm: 75,
                    } : {},
                    consentimientoParental: tipoUsuario === 'adulto',
                },
            });
        }

        // Generar JWT
        const token = generateJWT(usuario.id, usuario.email, usuario.tipoUsuario as 'menor' | 'adulto');

        // Redirigir con token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${usuario.id}&tipo=${tipoUsuario}`);
    } catch (error) {
        console.error('Error en mock Microsoft OAuth:', error);
        res.redirect(`${FRONTEND_URL}?error=mock_auth_failed`);
    }
});

export default router;
