import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth';
import { registerCashierSchema, loginSchema } from '../schemas';

export const authRoutes = Router();

authRoutes.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerCashierSchema.parse(req.body);
    const cashier = await authService.registerCashier(data);
    res.status(201).json({
      success: true,
      data: cashier,
    });
  } catch (error) {
    next(error);
  }
});

authRoutes.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
