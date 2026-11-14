import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: err.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message
          }))
        });
        return;
      }
      next(err);
    }
  };
};

export const validateQuery = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: 'Invalid query parameters',
          details: err.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message
          }))
        });
        return;
      }
      next(err);
    }
  };
};

export const validateParams = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: 'Invalid route parameters',
          details: err.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message
          }))
        });
        return;
      }
      next(err);
    }
  };
};
