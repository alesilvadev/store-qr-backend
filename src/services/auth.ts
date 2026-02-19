import * as cashierDb from '../db/cashiers';
import { RegisterCashierInput, LoginInput } from '../schemas';
import { UnauthorizedError, ValidationError } from '../utils/errors';
import { setToken } from '../middleware/auth';
import * as crypto from 'crypto';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const authService = {
  async registerCashier(data: RegisterCashierInput) {
    const existing = cashierDb.getCashierByEmail(data.email);
    if (existing) {
      throw new ValidationError('Email already registered');
    }

    const cashier = cashierDb.createCashier(data.email, data.password, data.name);
    return {
      id: cashier.id,
      email: cashier.email,
      name: cashier.name,
      role: cashier.role,
    };
  },

  async login(data: LoginInput) {
    const cashier = cashierDb.getCashierByEmail(data.email);
    if (!cashier) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordValid = cashierDb.verifyPassword(data.password, cashier.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken();
    setToken(token, {
      id: cashier.id,
      email: cashier.email,
      role: cashier.role,
    });

    return {
      token,
      user: {
        id: cashier.id,
        email: cashier.email,
        name: cashier.name,
        role: cashier.role,
      },
    };
  },
};
