import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from '../orders';
import * as orderDb from '../../db/orders';
import { productService } from '../products';
import { ValidationError, NotFoundError } from '../../utils/errors';

vi.mock('../../db/orders');
vi.mock('../products');

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should successfully create order with valid items', async () => {
      const mockProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Test Product',
        price: 100,
        stock: 50,
        description: 'Test',
        colors: [],
      };

      vi.mocked(productService.getProductBySku).mockResolvedValue(mockProduct);
      vi.mocked(orderDb.createOrder).mockReturnValue({
        id: 'order-1',
        code: 'ORD-001',
        items: [
          {
            productId: 'prod-1',
            sku: 'SKU001',
            name: 'Test Product',
            price: 100,
            quantity: 2,
            color: '',
            subtotal: 200,
          },
        ],
        buyList: [
          {
            productId: 'prod-1',
            sku: 'SKU001',
            name: 'Test Product',
            price: 100,
            quantity: 2,
            color: '',
            subtotal: 200,
          },
        ],
        wishList: [],
        total: 200,
        status: 'pending',
        clientId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await orderService.createOrder({
        buyList: [{ sku: 'SKU001', quantity: 2 }],
        clientId: undefined,
      });

      expect(result.code).toBe('ORD-001');
      expect(result.total).toBe(200);
      expect(result.status).toBe('pending');
    });

    it('should reject order with insufficient stock', async () => {
      const mockProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Test Product',
        price: 100,
        stock: 1,
        description: 'Test',
        colors: [],
      };

      vi.mocked(productService.getProductBySku).mockResolvedValue(mockProduct);

      await expect(
        orderService.createOrder({
          buyList: [{ sku: 'SKU001', quantity: 5 }],
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getOrderByCode', () => {
    it('should retrieve order by code', async () => {
      const mockOrder = {
        id: 'order-1',
        code: 'ORD-001',
        items: [],
        buyList: [],
        wishList: [],
        total: 200,
        status: 'pending',
        clientId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(orderDb.getOrderByCode).mockReturnValue(mockOrder);

      const result = await orderService.getOrderByCode('ORD-001');

      expect(result.code).toBe('ORD-001');
      expect(result.total).toBe(200);
    });

    it('should throw error for non-existent order code', async () => {
      vi.mocked(orderDb.getOrderByCode).mockReturnValue(null);

      await expect(orderService.getOrderByCode('INVALID')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const mockOrder = {
        id: 'order-1',
        code: 'ORD-001',
        items: [],
        buyList: [],
        wishList: [],
        total: 200,
        status: 'pending',
        clientId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(orderDb.getOrderById).mockReturnValue(mockOrder);
      vi.mocked(orderDb.updateOrder).mockReturnValue({
        ...mockOrder,
        status: 'paid',
      });

      const result = await orderService.updateOrderStatus('order-1', { status: 'paid' });

      expect(result.status).toBe('paid');
      expect(vi.mocked(orderDb.updateOrder)).toHaveBeenCalledWith('order-1', { status: 'paid' });
    });

    it('should throw error for non-existent order', async () => {
      vi.mocked(orderDb.getOrderById).mockReturnValue(null);

      await expect(orderService.updateOrderStatus('invalid-id', { status: 'paid' })).rejects.toThrow(NotFoundError);
    });
  });
});
