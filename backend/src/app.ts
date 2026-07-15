import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/env.config';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';
import { authRouter } from './routes/auth.routes';

const app = express();


// Middlewares Globales

app.use(helmet());
app.use(cors({ origin: envConfig.corsOrigin }));
app.use(morgan(envConfig.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use('/api', apiRateLimiter);

// rutas mi rey pendiente aca va toda vaina
app.use('/api/auth', authRouter);


app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


//pa manejo de errores

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
