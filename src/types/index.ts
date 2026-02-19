export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  colors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  code: string;
  items: OrderItem[];
  buyList: OrderItem[];
  wishList: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cashier {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'cashier' | 'admin';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
