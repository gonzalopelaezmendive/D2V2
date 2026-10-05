import { Router } from 'express';
import { generateJWT } from '../config/oauth.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5178';

/**
 * MOCK OAuth SIMPLIFICADO para desarrollo
 * No requiere base de datos, solo genera JWT
 */

// Mock de Google OAuth
router.get('/mock/google', async (req, res) => {
    try {
        const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';

        // Generar ID y datos mock
        const mockUserId = `mock-${tipoUsuario}-google-${Date.now()}`;
        const mockEmail = tipoUsuario === 'menor' ? 'estudiante.mock@gmail.com' : 'padre.mock@gmail.com';

        // Generar JWT
        const token = generateJWT(mockUserId, mockEmail, tipoUsuario);

        // Redirigir con token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${mockUserId}&tipo=${tipoUsuario}`);
    } catch (error) {
        console.error('Error en mock Google OAuth:', error);
        res.redirect(`${FRONTEND_URL}?error=mock_auth_failed`);
    }
});

// Mock de Microsoft OAuth
router.get('/mock/microsoft', async (req, res) => {
    try {
        const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';

        // Generar ID y datos mock
        const mockUserId = `mock-${tipoUsuario}-microsoft-${Date.now()}`;
        const mockEmail = tipoUsuario === 'menor' ? 'estudiante.mock@outlook.com' : 'padre.mock@outlook.com';

        // Generar JWT
        const token = generateJWT(mockUserId, mockEmail, tipoUsuario);

        // Redirigir con token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${mockUserId}&tipo=${tipoUsuario}`);
    } catch (error) {
        console.error('Error en mock Microsoft OAuth:', error);
        res.redirect(`${FRONTEND_URL}?error=mock_auth_failed`);
    }
});

// Endpoint mock de verificación
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // En modo mock, aceptamos cualquier token como válido
    res.json({
        valid: true,
        usuario: {
            id: 'mock-user-id',
            nombre: 'Usuario Mock',
            email: 'mock@example.com',
            edad: 10,
            tipoUsuario: 'menor',
            consentimientoParental: false,
        }
    });
});

export default router;
