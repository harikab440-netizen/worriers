import { Router, Response, NextFunction } from 'express';
import {
  ListingQuerySchema,
  CreateListingSchema,
  UpdateListingSchema,
  CreateContactRequestSchema
} from '@campus/shared';
import { dbService } from '../services/db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { AuthenticatedRequest } from '../lib/types.js';

export const listingsRouter: Router = Router();

// Helper to get string param
const getParamId = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;

// GET /api/v1/listings - Public search & filter
listingsRouter.get(
  '/',
  validateQuery(ListingQuerySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await dbService.getListings(req.query as any);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/listings/:id - Fetch single listing
listingsRouter.get(
  '/:id',
  optionalAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getParamId(req.params.id);
      const listing = await dbService.getListingById(id, req.user?.id);
      if (!listing) {
        res.status(404).json({ error: 'Listing not found or no longer active' });
        return;
      }
      res.json(listing);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/v1/listings - Authenticated create
listingsRouter.post(
  '/',
  requireAuth,
  validateBody(CreateListingSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const created = await dbService.createListing(user.id, user.display_name, req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/listings/:id - Authenticated owner edit or status update
listingsRouter.patch(
  '/:id',
  requireAuth,
  validateBody(UpdateListingSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = getParamId(req.params.id);
      const updated = await dbService.updateListing(id, user.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Listing not found or access denied' });
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

// DELETE /api/v1/listings/:id - Authenticated owner delete
listingsRouter.delete(
  '/:id',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = getParamId(req.params.id);
      const success = await dbService.deleteListing(id, user.id);
      if (!success) {
        res.status(404).json({ error: 'Listing not found or access denied' });
        return;
      }
      res.json({ message: 'Listing deleted successfully' });
    } catch (error: any) {
      if (error.message?.includes('Forbidden')) {
        res.status(403).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
);

// POST /api/v1/listings/:id/contact-requests - Authenticated contact request creation
listingsRouter.post(
  '/:id/contact-requests',
  requireAuth,
  contactLimiter,
  validateBody(CreateContactRequestSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = getParamId(req.params.id);
      const request = await dbService.createContactRequest(
        id,
        user.id,
        user.display_name,
        req.body
      );
      res.status(201).json(request);
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('cannot send a contact request to your own')) {
        res.status(400).json({ error: 'You cannot send a contact request to your own listing' });
        return;
      }
      if (msg.includes('already have a pending contact request')) {
        res.status(409).json({ error: msg });
        return;
      }
      if (msg.includes('only be sent for active listings')) {
        res.status(400).json({ error: msg });
        return;
      }
      if (msg.includes('Listing not found')) {
        res.status(404).json({ error: 'Listing not found' });
        return;
      }
      next(error);
    }
  }
);
