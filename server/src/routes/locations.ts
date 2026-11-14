import { Router, Request, Response, NextFunction } from 'express';
import { dbService } from '../services/db.js';

export const locationsRouter: Router = Router();

locationsRouter.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await dbService.getLocations();
    res.json(locations);
  } catch (error) {
    next(error);
  }
});
