/**
 * @file app.ts
 * @description Express application wiring for the SnehoAyu backend.
 *
 * This module builds the app without opening a network listener, which keeps
 * it reusable from both `index.ts` and integration tests.
 */

import express, { type Request, type Response } from 'express';
import helmet from 'helmet';

import { corsMiddleware } from './config/cors.js';
import { requestLogger } from './middlewares/logger.js';
import {
  notFoundHandler,
  globalErrorHandler,
} from './middlewares/errorHandler.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/authRoutes.js';
import onboardingRouter from './routes/onboardingRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import checklistRouter from './routes/checklistRoutes.js';
import assessmentRouter from './routes/assessmentRoutes.js';
import growthRouter from './routes/growthRoutes.js';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger);

app.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    service: 'SnehoAyu mHealth API',
    version: '1.0.0',
    description:
      'Backend for SnehoAyu — a mobile-first PWA supporting preterm infant care in West Bengal.',
    docs: 'https://github.com/your-org/snehoayu',
    health: '/api/health',
  });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/growth', growthRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
