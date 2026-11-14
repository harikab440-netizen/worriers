import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../lib/types.js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { dbService } from '../services/db.js';

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    return;
  }

  const token = authHeader.split(' ')[1].trim();
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Token is empty.' });
    return;
  }

  try {
    // 1. Check for local dev/testing token pattern
    if (token.startsWith('mock-user-') || token.startsWith('test-token-')) {
      const mockUserId = token.startsWith('mock-user-') ? token : 'user-demo-1';
      const profile = await dbService.getProfile(mockUserId);
      req.user = {
        id: mockUserId,
        email: `${mockUserId}@campus.edu`,
        display_name: profile?.display_name || 'Campus Student'
      };
      next();
      return;
    }

    // 2. Real Supabase auth verification
    if (isSupabaseConfigured()) {
      const {
        data: { user },
        error
      } = await getSupabaseClient().auth.getUser(token);

      if (error || !user) {
        res.status(401).json({ error: 'Invalid or expired session token.' });
        return;
      }

      // Fetch profile display name
      const profile = await dbService.getProfile(user.id);
      const displayName =
        profile?.display_name ||
        user.user_metadata?.display_name ||
        user.email?.split('@')[0] ||
        'Campus User';

      req.user = {
        id: user.id,
        email: user.email || '',
        display_name: displayName
      };
      next();
      return;
    }

    // Fallback if Supabase not configured but token was provided
    req.user = {
      id: 'demo-user-id',
      email: 'student@campus.edu',
      display_name: 'Demo Student'
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1].trim();
  if (!token) return next();

  try {
    if (token.startsWith('mock-user-') || token.startsWith('test-token-')) {
      const mockUserId = token.startsWith('mock-user-') ? token : 'user-demo-1';
      const profile = await dbService.getProfile(mockUserId);
      req.user = {
        id: mockUserId,
        email: `${mockUserId}@campus.edu`,
        display_name: profile?.display_name || 'Campus Student'
      };
      return next();
    }

    if (isSupabaseConfigured()) {
      const {
        data: { user },
        error
      } = await getSupabaseClient().auth.getUser(token);

      if (!error && user) {
        const profile = await dbService.getProfile(user.id);
        req.user = {
          id: user.id,
          email: user.email || '',
          display_name:
            profile?.display_name ||
            user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'Campus User'
        };
      }
    }
  } catch {
    // Ignore error for optional auth
  }

  next();
};
