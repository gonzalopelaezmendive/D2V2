import { Router } from 'express';
import passport from '../config/oauth.js';
import { generateJWT, verifyJWT } from '../config/oauth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5178';

// ==================== GOOGLE OAUTH ====================

// Iniciar autenticación con Google
router.get('/google', (req, res, next) => {
  const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';

  // Guardar el tipo de usuario en la sesión para recuperarlo en el callback
  (req.session as any).tipoUsuario = tipoUsuario;

  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

// Callback de Google OAuth
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}?error=auth_failed` }),
  async (req, res) => {
    try {
      const userData = req.user as any;
      const tipoUsuario = (req.session as any).tipoUsuario || 'menor';

      // Buscar o crear usuario en la base de datos
      let usuario = await prisma.usuario.findUnique({
        where: {
          email: userData.email,
        },
      });

      if (!usuario) {
        // Crear nuevo usuario
        usuario = await prisma.usuario.create({
          data: {
            nombre: userData.nombre,
            email: userData.email,
            edad: tipoUsuario === 'menor' ? 10 : 35, // Default, luego se actualizará
            tipoUsuario,
            oauthProvider: userData.oauthProvider,
            oauthId: userData.oauthId,
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

      // Redirigir al frontend con el token
      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${usuario.id}&tipo=${tipoUsuario}`);
    } catch (error) {
      console.error('Error en Google OAuth callback:', error);
      res.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
  }
);

// ==================== MICROSOFT OAUTH ====================

// Iniciar autenticación con Microsoft
router.get('/microsoft', (req, res, next) => {
  const tipoUsuario = req.query.tipo as 'menor' | 'adulto' || 'menor';
  (req.session as any).tipoUsuario = tipoUsuario;

  passport.authenticate('microsoft', {
    scope: ['user.read'],
  })(req, res, next);
});

// Callback de Microsoft OAuth
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: `${FRONTEND_URL}?error=auth_failed` }),
  async (req, res) => {
    try {
      const userData = req.user as any;
      const tipoUsuario = (req.session as any).tipoUsuario || 'menor';

      let usuario = await prisma.usuario.findUnique({
        where: {
          email: userData.email,
        },
      });

      if (!usuario) {
        usuario = await prisma.usuario.create({
          data: {
            nombre: userData.nombre,
            email: userData.email,
            edad: tipoUsuario === 'menor' ? 10 : 35,
            tipoUsuario,
            oauthProvider: userData.oauthProvider,
            oauthId: userData.oauthId,
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

      const token = generateJWT(usuario.id, usuario.email, usuario.tipoUsuario as 'menor' | 'adulto');
      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&userId=${usuario.id}&tipo=${tipoUsuario}`);
    } catch (error) {
      console.error('Error en Microsoft OAuth callback:', error);
      res.redirect(`${FRONTEND_URL}?error=auth_failed`);
    }
  }
);

// ==================== VERIFICACIÓN DE TOKEN ====================

// Endpoint para verificar token JWT
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Obtener información del usuario
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: (decoded as any).userId,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        edad: true,
        tipoUsuario: true,
        consentimientoParental: true,
        perfilClinico: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ valid: true, usuario });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== LOGOUT ====================

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

export default router;
