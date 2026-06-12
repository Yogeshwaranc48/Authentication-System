import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
