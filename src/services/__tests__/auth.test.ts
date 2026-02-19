import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth';
import * as cashierDb from '../../db/cashiers';
import { ValidationError, UnauthorizedError } from '../../utils/errors';

vi.mock('../../db/cashiers');
vi.mock('../../middleware/auth', () => ({
  setToken: vi.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerCashier', () => {
    it('should successfully register a new cashier', async () => {
      const mockCashier = {
        id: 'cashier-1',
        email: 'test@example.com',
        name: 'Test Cashier',
        role: 'cashier',
        passwordHash: 'hashed',
      };

      vi.mocked(cashierDb.getCashierByEmail).mockReturnValue(null);
      vi.mocked(cashierDb.createCashier).mockReturnValue(mockCashier);

      const result = await authService.registerCashier({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Test Cashier',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test Cashier');
      expect(result.role).toBe('cashier');
      expect(vi.mocked(cashierDb.createCashier)).toHaveBeenCalled();
    });

    it('should reject duplicate email registration', async () => {
      vi.mocked(cashierDb.getCashierByEmail).mockReturnValue({
        id: 'cashier-1',
        email: 'test@example.com',
        name: 'Existing',
        role: 'cashier',
        passwordHash: 'hash',
      });

      await expect(
        authService.registerCashier({
          email: 'test@example.com',
          password: 'SecurePass123',
          name: 'Test Cashier',
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockCashier = {
        id: 'cashier-1',
        email: 'test@example.com',
        name: 'Test Cashier',
        role: 'cashier',
        passwordHash: 'hashed-password',
      };

      vi.mocked(cashierDb.getCashierByEmail).mockReturnValue(mockCashier);
      vi.mocked(cashierDb.verifyPassword).mockReturnValue(true);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'SecurePass123',
      });

      expect(result.token).toBeTruthy();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.id).toBe('cashier-1');
    });

    it('should reject invalid email', async () => {
      vi.mocked(cashierDb.getCashierByEmail).mockReturnValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'AnyPassword123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should reject invalid password', async () => {
      const mockCashier = {
        id: 'cashier-1',
        email: 'test@example.com',
        name: 'Test Cashier',
        role: 'cashier',
        passwordHash: 'hashed-password',
      };

      vi.mocked(cashierDb.getCashierByEmail).mockReturnValue(mockCashier);
      vi.mocked(cashierDb.verifyPassword).mockReturnValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
