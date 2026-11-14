import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API requests
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Stricter rate limiter for sensitive endpoints (contact requests, creation)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Contact request limit reached. Please wait a few minutes before trying again.'
  }
});

// AI endpoints limiter (rate-limited per user/IP)
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI assistance rate limit reached. Please wait before generating more suggestions.'
  }
});
