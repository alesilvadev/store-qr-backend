import * as productDb from './db/products';
import * as cashierDb from './db/cashiers';

export function seedDatabase() {
  productDb.createProduct({
    sku: 'SKU001',
    name: 'T-Shirt Classic',
    price: 29.99,
    description: 'Classic cotton t-shirt',
    stock: 100,
    colors: ['red', 'blue', 'white', 'black'],
  });

  productDb.createProduct({
    sku: 'SKU002',
    name: 'Jeans Premium',
    price: 79.99,
    description: 'Premium denim jeans',
    stock: 50,
    colors: ['blue', 'black'],
  });

  productDb.createProduct({
    sku: 'SKU003',
    name: 'Sneakers Sport',
    price: 99.99,
    description: 'Sport sneakers',
    stock: 25,
  });

  productDb.createProduct({
    sku: 'SKU004',
    name: 'Jacket Winter',
    price: 149.99,
    description: 'Winter jacket',
    stock: 30,
    colors: ['black', 'brown', 'gray'],
  });

  cashierDb.createCashier('cashier@example.com', 'password123', 'John Cashier', 'cashier');
  cashierDb.createCashier('admin@example.com', 'admin123', 'Admin User', 'admin');
}
