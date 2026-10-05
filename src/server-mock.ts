import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import passport from './config/oauth.js';
import authMockSimpleRoutes from './routes/auth-mock-simple.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5178',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'temp-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    },
}));
app.use(passport.initialize());
app.use(passport.session());

// Rutas mock (sin base de datos)
app.use('/api/auth', authMockSimpleRoutes);

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        mode: 'MOCK - Sin base de datos',
        message: 'Servidor corriendo en modo de desarrollo con OAuth mock',
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor MOCK de D2V2 corriendo en http://localhost:${PORT}`);
    console.log(`📝 Modo: DESARROLLO (OAuth simulado, sin base de datos)`);
    console.log(`✅ Puedes probar el flujo de login en: http://localhost:5178/`);
});
