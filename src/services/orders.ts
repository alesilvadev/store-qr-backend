import * as orderDb from '../db/orders';
import { productService } from './products';
import { CreateOrderInput, UpdateOrderStatusInput } from '../schemas';
import { NotFoundError, ValidationError } from '../utils/errors';
import { OrderItem } from '../types';

async function validateAndPrepareItems(items: any[]): Promise<OrderItem[]> {
  const prepared: OrderItem[] = [];

  for (const item of items) {
    const product = await productService.getProductBySku(item.sku);

    if (product.stock < item.quantity) {
      throw new ValidationError(`Insufficient stock for ${product.name}`);
    }

    prepared.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      color: item.color,
      subtotal: product.price * item.quantity,
    });
  }

  return prepared;
}

export const orderService = {
  async createOrder(data: CreateOrderInput) {
    const buyList = await validateAndPrepareItems(data.buyList);
    const wishList = data.wishList ? await validateAndPrepareItems(data.wishList) : [];

    const total = buyList.reduce((sum, item) => sum + item.subtotal, 0);

    const order = orderDb.createOrder({
      items: [...buyList, ...wishList],
      buyList,
      wishList,
      total,
      status: 'pending',
      clientId: data.clientId,
    });

    return {
      id: order.id,
      code: order.code,
      buyList: order.buyList,
      wishList: order.wishList,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    };
  },

  async getOrderByCode(code: string) {
    const order = orderDb.getOrderByCode(code);
    if (!order) {
      throw new NotFoundError(`Order with code ${code} not found`);
    }
    return {
      id: order.id,
      code: order.code,
      buyList: order.buyList,
      wishList: order.wishList,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },

  async getOrderById(id: string) {
    const order = orderDb.getOrderById(id);
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }
    return {
      id: order.id,
      code: order.code,
      buyList: order.buyList,
      wishList: order.wishList,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },

  async getAllOrders() {
    return orderDb.getAllOrders().map(order => ({
      id: order.id,
      code: order.code,
      buyList: order.buyList,
      wishList: order.wishList,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const order = orderDb.getOrderById(id);
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    return orderDb.updateOrder(id, {
      status: data.status,
    });
  },

  async deleteOrder(id: string) {
    const order = orderDb.getOrderById(id);
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }
    orderDb.deleteOrder(id);
    return { success: true };
  },
};
