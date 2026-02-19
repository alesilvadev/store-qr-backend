import { Product } from '../types';

const products: Map<string, Product> = new Map();
let productIdCounter = 1;

export function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const id = `prod_${productIdCounter++}`;
  const product: Product = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  products.set(id, product);
  return product;
}

export function getProductBySku(sku: string): Product | undefined {
  for (const product of products.values()) {
    if (product.sku === sku) {
      return product;
    }
  }
  return undefined;
}

export function getProductById(id: string): Product | undefined {
  return products.get(id);
}

export function getAllProducts(): Product[] {
  return Array.from(products.values());
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | undefined {
  const product = products.get(id);
  if (!product) return undefined;

  const updated: Product = {
    ...product,
    ...data,
    updatedAt: new Date(),
  };
  products.set(id, updated);
  return updated;
}

export function deleteProduct(id: string): boolean {
  return products.delete(id);
}
