import { Router, Response, NextFunction } from 'express';
import { RespondContactRequestSchema } from '@campus/shared';
import { dbService } from '../services/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { AuthenticatedRequest } from '../lib/types.js';

export const contactRequestsRouter: Router = Router();

const getParamId = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;

// GET /api/v1/contact-requests/:id - View contact request details (sender or listing owner)
contactRequestsRouter.get(
  '/:id',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = getParamId(req.params.id);
      const item = await dbService.getContactRequestById(id, user.id);
      if (!item) {
        res.status(404).json({ error: 'Contact request not found or access unauthorized' });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/contact-requests/:id - Listing owner responds or closes request
contactRequestsRouter.patch(
  '/:id',
  requireAuth,
  validateBody(RespondContactRequestSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = getParamId(req.params.id);
      const updated = await dbService.respondContactRequest(id, user.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Contact request not found or access denied' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      if (error.message?.includes('Forbidden')) {
        res.status(403).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
);
