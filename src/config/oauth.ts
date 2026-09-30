import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'temp-jwt-secret-change-in-production';

// Configurar Google OAuth
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extraer información del perfil
          const userData = {
            oauthProvider: 'google',
            oauthId: profile.id,
            email: profile.emails?.[0]?.value || '',
            nombre: profile.displayName || '',
            avatar: profile.photos?.[0]?.value || '',
          };

          return done(null, userData);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Configurar Microsoft OAuth
if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: MICROSOFT_CLIENT_ID,
        clientSecret: MICROSOFT_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/microsoft/callback`,
        scope: ['user.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            oauthProvider: 'microsoft',
            oauthId: profile.id,
            email: profile.emails?.[0]?.value || '',
            nombre: profile.displayName || '',
            avatar: '',
          };

          return done(null, userData);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Serialización de usuario (para sesiones)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Función para generar JWT
export const generateJWT = (userId: string, email: string, tipoUsuario: 'menor' | 'adulto') => {
  return jwt.sign(
    {
      userId,
      email,
      tipoUsuario,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware para verificar JWT
export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default passport;
