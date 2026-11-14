import { Router, Response, NextFunction } from 'express';
import {
  SuggestCategoryRequestSchema,
  ImproveDescriptionRequestSchema
} from '@campus/shared';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { aiLimiter } from '../middleware/rateLimiters.js';
import { AuthenticatedRequest } from '../lib/types.js';
import {
  suggestCategoryWithGemini,
  improveDescriptionWithGemini
} from '../lib/gemini.js';

export const aiRouter: Router = Router();

// POST /api/v1/ai/suggest-category
aiRouter.post(
  '/suggest-category',
  requireAuth,
  aiLimiter,
  validateBody(SuggestCategoryRequestSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description } = req.body;
      const result = await suggestCategoryWithGemini(title, description);

      if (!result.success || !result.data) {
        res.status(503).json({
          error: result.message || 'AI category suggestion service is currently unavailable.',
          fallback_category: 'Other'
        });
        return;
      }

      res.json(result.data);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/ai/improve-description
aiRouter.post(
  '/improve-description',
  requireAuth,
  aiLimiter,
  validateBody(ImproveDescriptionRequestSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { description } = req.body;
      const result = await improveDescriptionWithGemini(description);

      if (!result.success || !result.data) {
        res.status(503).json({
          error: result.message || 'AI description assistance is currently unavailable.',
          improved_description: description,
          warnings: []
        });
        return;
      }

      res.json(result.data);
    } catch (error) {
      next(error);
    }
  }
);
