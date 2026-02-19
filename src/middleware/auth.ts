import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const VALID_TOKENS: Record<string, { id: string; email: string; role: string }> = {};

export async function authenticateCashier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const user = VALID_TOKENS[token];

    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorizeCashier(roles: string[] = ['cashier', 'admin']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

export function setToken(token: string, user: { id: string; email: string; role: string }) {
  VALID_TOKENS[token] = user;
}

export function getToken(token: string) {
  return VALID_TOKENS[token];
}
