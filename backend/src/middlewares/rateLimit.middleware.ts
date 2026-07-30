import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/env.config';

export const apiRateLimiter = rateLimit({
  windowMs: envConfig.rateLimit.windowMs,
  max: envConfig.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
