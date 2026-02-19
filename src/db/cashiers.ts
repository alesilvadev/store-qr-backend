import { Cashier } from '../types';
import * as crypto from 'crypto';

const cashiers: Map<string, Cashier> = new Map();
let cashierIdCounter = 1;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function createCashier(email: string, password: string, name: string, role: 'cashier' | 'admin' = 'cashier'): Cashier {
  const id = `cashier_${cashierIdCounter++}`;
  const cashier: Cashier = {
    id,
    email,
    passwordHash: hashPassword(password),
    name,
    role,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  cashiers.set(id, cashier);
  return cashier;
}

export function getCashierByEmail(email: string): Cashier | undefined {
  for (const cashier of cashiers.values()) {
    if (cashier.email === email && cashier.active) {
      return cashier;
    }
  }
  return undefined;
}

export function getCashierById(id: string): Cashier | undefined {
  return cashiers.get(id);
}

export function getAllCashiers(): Cashier[] {
  return Array.from(cashiers.values()).filter(c => c.active);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
