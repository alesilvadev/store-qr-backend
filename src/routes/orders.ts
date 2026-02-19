import { Router, Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orders';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas';
import { authenticateCashier, authorizeCashier } from '../middleware/auth';

export const orderRoutes = Router();

orderRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(data);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

orderRoutes.get('/code/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderByCode(req.params.code);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

orderRoutes.get('/:id', authenticateCashier, authorizeCashier(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

orderRoutes.get('/', authenticateCashier, authorizeCashier(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

orderRoutes.patch('/:id/status', authenticateCashier, authorizeCashier(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateOrderStatusSchema.parse(req.body);
    const order = await orderService.updateOrderStatus(req.params.id, data);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

orderRoutes.delete('/:id', authenticateCashier, authorizeCashier(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.json({
      success: true,
      message: 'Order deleted',
    });
  } catch (error) {
    next(error);
  }
});
