import { Router, Response, NextFunction } from 'express';
import { UpdateProfileSchema } from '@campus/shared';
import { dbService } from '../services/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { AuthenticatedRequest } from '../lib/types.js';

export const meRouter: Router = Router();

// GET /api/v1/me/listings - Authenticated user's listings
meRouter.get(
  '/listings',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const listings = await dbService.getUserListings(user.id);
      res.json(listings);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/me/contact-requests - User's received and sent contact requests
meRouter.get(
  '/contact-requests',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const requests = await dbService.getUserContactRequests(user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/me/profile - Current user's profile
meRouter.get(
  '/profile',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const profile = await dbService.getProfile(user.id);
      res.json({
        id: user.id,
        email: user.email,
        display_name: profile?.display_name || user.display_name
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/me/profile - Update user's display name
meRouter.patch(
  '/profile',
  requireAuth,
  validateBody(UpdateProfileSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const updated = await dbService.ensureProfile(user.id, req.body.display_name);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);
