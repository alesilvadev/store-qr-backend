import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().nonnegative('Stock cannot be negative'),
  colors: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().nonnegative().optional(),
  colors: z.array(z.string()).optional(),
});

export const createOrderItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  color: z.string().optional(),
});

export const createOrderSchema = z.object({
  buyList: z.array(createOrderItemSchema),
  wishList: z.array(createOrderItemSchema).optional(),
  clientId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'delivered', 'cancelled']),
});

export const registerCashierSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type RegisterCashierInput = z.infer<typeof registerCashierSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
