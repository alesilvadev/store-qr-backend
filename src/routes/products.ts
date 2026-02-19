import { Router, Request, Response, NextFunction } from 'express';
import { productService } from '../services/products';
import { createProductSchema, updateProductSchema } from '../schemas';

export const productRoutes = Router();

productRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.get('/sku/:sku', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductBySku(req.params.sku);
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, data);
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

productRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    next(error);
  }
});
