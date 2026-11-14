import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_MIME_TYPES } from '@campus/shared';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are permitted.'));
    }
  }
});

/**
 * Validates magic bytes / file signatures to prevent MIME-type spoofing
 */
export function validateImageSignature(buffer: Buffer): { valid: boolean; detectedMime?: string } {
  if (!buffer || buffer.length < 12) {
    return { valid: false };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedMime: 'image/png' };
  }

  // WebP: 'RIFF' .... 'WEBP'
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  if (isRiff && isWebp) {
    return { valid: true, detectedMime: 'image/webp' };
  }

  return { valid: false };
}

export const validateUploadedImage = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded' });
    return;
  }

  if (req.file.size > MAX_IMAGE_SIZE_BYTES) {
    res.status(400).json({ error: 'Image size exceeds maximum limit of 5MB' });
    return;
  }

  const { valid } = validateImageSignature(req.file.buffer);
  if (!valid) {
    res.status(400).json({
      error: 'Invalid file signature. File is not a valid JPEG, PNG, or WebP image.'
    });
    return;
  }

  next();
};
