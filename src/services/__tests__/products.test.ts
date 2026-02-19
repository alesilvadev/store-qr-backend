import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '../products';
import * as productDb from '../../db/products';
import { NotFoundError } from '../../utils/errors';

vi.mock('../../db/products');

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should successfully create a new product', async () => {
      const mockProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Test Product',
        price: 99.99,
        stock: 100,
        description: 'A test product',
        imageUrl: 'https://example.com/image.jpg',
        colors: ['red', 'blue'],
      };

      vi.mocked(productDb.createProduct).mockReturnValue(mockProduct);

      const result = await productService.createProduct({
        sku: 'SKU001',
        name: 'Test Product',
        price: 99.99,
        stock: 100,
        description: 'A test product',
        imageUrl: 'https://example.com/image.jpg',
        colors: ['red', 'blue'],
      });

      expect(result.sku).toBe('SKU001');
      expect(result.name).toBe('Test Product');
      expect(result.price).toBe(99.99);
      expect(result.stock).toBe(100);
    });
  });

  describe('getProductBySku', () => {
    it('should retrieve product by SKU', async () => {
      const mockProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Test Product',
        price: 99.99,
        stock: 100,
        description: 'A test product',
        imageUrl: 'https://example.com/image.jpg',
        colors: [],
      };

      vi.mocked(productDb.getProductBySku).mockReturnValue(mockProduct);

      const result = await productService.getProductBySku('SKU001');

      expect(result.sku).toBe('SKU001');
      expect(result.name).toBe('Test Product');
      expect(vi.mocked(productDb.getProductBySku)).toHaveBeenCalledWith('SKU001');
    });

    it('should throw error for non-existent SKU', async () => {
      vi.mocked(productDb.getProductBySku).mockReturnValue(null);

      await expect(productService.getProductBySku('INVALID_SKU')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProduct', () => {
    it('should successfully update product', async () => {
      const originalProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Old Name',
        price: 50,
        stock: 100,
        description: 'Old description',
        imageUrl: 'https://example.com/old.jpg',
        colors: [],
      };

      const updatedProduct = {
        ...originalProduct,
        name: 'New Name',
        price: 75,
      };

      vi.mocked(productDb.getProductById).mockReturnValue(originalProduct);
      vi.mocked(productDb.updateProduct).mockReturnValue(updatedProduct);

      const result = await productService.updateProduct('prod-1', {
        name: 'New Name',
        price: 75,
      });

      expect(result.name).toBe('New Name');
      expect(result.price).toBe(75);
      expect(vi.mocked(productDb.updateProduct)).toHaveBeenCalledWith('prod-1', {
        name: 'New Name',
        price: 75,
      });
    });

    it('should throw error when updating non-existent product', async () => {
      vi.mocked(productDb.getProductById).mockReturnValue(null);

      await expect(productService.updateProduct('invalid-id', { name: 'New Name' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteProduct', () => {
    it('should successfully delete product', async () => {
      const mockProduct = {
        id: 'prod-1',
        sku: 'SKU001',
        name: 'Test Product',
        price: 99.99,
        stock: 100,
        description: 'A test product',
        imageUrl: 'https://example.com/image.jpg',
        colors: [],
      };

      vi.mocked(productDb.getProductById).mockReturnValue(mockProduct);
      vi.mocked(productDb.deleteProduct).mockReturnValue(undefined);

      const result = await productService.deleteProduct('prod-1');

      expect(result.success).toBe(true);
      expect(vi.mocked(productDb.deleteProduct)).toHaveBeenCalledWith('prod-1');
    });

    it('should throw error when deleting non-existent product', async () => {
      vi.mocked(productDb.getProductById).mockReturnValue(null);

      await expect(productService.deleteProduct('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });
});
