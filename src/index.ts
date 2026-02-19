import { onRequest } from 'firebase-functions/v2/https';
import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : true;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export const api = onRequest({ cors: false }, app);
