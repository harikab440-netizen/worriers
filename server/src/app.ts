import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { generalLimiter } from './middleware/rateLimiters.js';
import { listingsRouter } from './routes/listings.js';
import { locationsRouter } from './routes/locations.js';
import { contactRequestsRouter } from './routes/contactRequests.js';
import { meRouter } from './routes/me.js';
import { aiRouter } from './routes/ai.js';
import { uploadRouter } from './routes/upload.js';
import { visionRouter } from './routes/vision.js';

dotenv.config();

export const app: express.Express = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, or can check against allowedOrigins
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers with size limit
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// General rate limiter
app.use('/api', generalLimiter);

// API v1 Router
const apiV1 = express.Router();

apiV1.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

apiV1.use('/listings', listingsRouter);
apiV1.use('/locations', locationsRouter);
apiV1.use('/contact-requests', contactRequestsRouter);
apiV1.use('/me', meRouter);
apiV1.use('/ai', aiRouter);
apiV1.use('/upload', uploadRouter);
apiV1.use('/vision', visionRouter);

app.use('/api/v1', apiV1);

// 404 handler for API routes
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(isDev && err.stack ? { stack: err.stack } : {})
  });
});
