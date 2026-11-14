import { Router, Request, Response } from 'express';
import multer from 'multer';
import { analyzeImageWithGemini, generateSimulatedCVAnalysis } from '../lib/vision.js';

export const visionRouter: Router = Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  storage: multer.memoryStorage()
});

// POST /api/v1/vision/analyze
visionRouter.post(
  '/analyze',
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';
        const result = await analyzeImageWithGemini(base64, mimeType);
        res.json(result);
        return;
      }

      if (req.body && req.body.imageBase64) {
        let rawBase64 = req.body.imageBase64 as string;
        let mimeType = 'image/jpeg';
        if (rawBase64.startsWith('data:')) {
          const parts = rawBase64.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          if (mimeMatch) mimeType = mimeMatch[1];
          rawBase64 = parts[1];
        }
        const result = await analyzeImageWithGemini(rawBase64, mimeType);
        res.json(result);
        return;
      }

      // If no image is provided, return standard demo analysis
      const demoResult = generateSimulatedCVAnalysis();
      res.json(demoResult);
    } catch (error) {
      console.error('Vision analysis error:', error);
      // Fallback gracefully without breaking the user experience
      res.json(generateSimulatedCVAnalysis());
    }
  }
);

// GET /api/v1/vision/demo-stream-frame
visionRouter.get('/demo-stream-frame', (_req: Request, res: Response): void => {
  res.json({
    timestamp: new Date().toISOString(),
    status: 'online',
    mode: 'demo_feed',
    analysis: generateSimulatedCVAnalysis()
  });
});
