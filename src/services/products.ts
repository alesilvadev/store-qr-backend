import * as productDb from '../db/products';
import { CreateProductInput, UpdateProductInput } from '../schemas';
import { NotFoundError } from '../utils/errors';

export const productService = {
  async createProduct(data: CreateProductInput) {
    return productDb.createProduct({
      sku: data.sku,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      stock: data.stock,
      colors: data.colors,
    });
  },

  async getProductBySku(sku: string) {
    const product = productDb.getProductBySku(sku);
    if (!product) {
      throw new NotFoundError(`Product with SKU ${sku} not found`);
    }
    return product;
  },

  async getProductById(id: string) {
    const product = productDb.getProductById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  },

  async getAllProducts() {
    return productDb.getAllProducts();
  },

  async updateProduct(id: string, data: UpdateProductInput) {
    const product = productDb.getProductById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return productDb.updateProduct(id, data);
  },

  async deleteProduct(id: string) {
    const product = productDb.getProductById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    productDb.deleteProduct(id);
    return { success: true };
  },
};
