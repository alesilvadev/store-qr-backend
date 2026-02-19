import { Order, OrderItem } from '../types';

const orders: Map<string, Order> = new Map();
let orderIdCounter = 1;

function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}${random}`;
}

export function createOrder(data: Omit<Order, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Order {
  const id = `order_${orderIdCounter++}`;
  const code = generateOrderCode();
  const order: Order = {
    id,
    code,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  orders.set(id, order);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id);
}

export function getOrderByCode(code: string): Order | undefined {
  for (const order of orders.values()) {
    if (order.code === code) {
      return order;
    }
  }
  return undefined;
}

export function getAllOrders(): Order[] {
  return Array.from(orders.values());
}

export function updateOrder(id: string, data: Partial<Omit<Order, 'id' | 'code' | 'createdAt'>>): Order | undefined {
  const order = orders.get(id);
  if (!order) return undefined;

  const updated: Order = {
    ...order,
    ...data,
    updatedAt: new Date(),
  };
  orders.set(id, updated);
  return updated;
}

export function deleteOrder(id: string): boolean {
  return orders.delete(id);
}
