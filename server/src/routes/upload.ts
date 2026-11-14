import { Router, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload, validateUploadedImage } from '../middleware/upload.js';
import { dbService } from '../services/db.js';
import { AuthenticatedRequest } from '../lib/types.js';

export const uploadRouter: Router = Router();

uploadRouter.post(
  '/image',
  requireAuth,
  upload.single('image'),
  validateUploadedImage,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file!;
      const result = await dbService.uploadListingImage(
        file.buffer,
        file.originalname,
        file.mimetype
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);
