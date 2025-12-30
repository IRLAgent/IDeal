import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth Debug:');
    console.log('   Authorization header:', authHeader);
    console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('   JWT_SECRET value:', process.env.JWT_SECRET);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('   ❌ No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('   Token (first 20 chars):', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = (decoded as any).userId;
    console.log('   ✅ Token valid, userId:', req.userId);
    next();
  } catch (error) {
    console.log('   ❌ Token verification failed:', error instanceof Error ? error.message : error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
