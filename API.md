# Store QR Backend API

## Products Endpoints

### Create Product
- **POST** `/api/products`
- **Body**: `{ sku: string, name: string, price: number, description?: string, imageUrl?: string, stock: number, colors?: string[] }`
- **Response**: `{ id: string, sku: string, name: string, price: number, stock: number, ... }`

### Get Product by ID
- **GET** `/api/products/:id`
- **Response**: `{ id: string, sku: string, name: string, price: number, stock: number, ... }`

### Get Product by SKU
- **GET** `/api/products/sku/:sku`
- **Response**: `{ id: string, sku: string, name: string, price: number, stock: number, ... }`

### List All Products
- **GET** `/api/products`
- **Response**: `[ { id: string, sku: string, name: string, price: number, ... } ]`

### Update Product
- **PUT** `/api/products/:id`
- **Body**: `{ name?: string, price?: number, description?: string, stock?: number, ... }`
- **Response**: `{ id: string, sku: string, name: string, ... }`

### Delete Product
- **DELETE** `/api/products/:id`
- **Response**: `{ success: true, message: string }`

## Orders Endpoints

### Create Order
- **POST** `/api/orders`
- **Body**: `{ buyList: [ { sku: string, quantity: number, color?: string } ], wishList?: [...] }`
- **Response**: `{ id: string, code: string, buyList: [...], wishList: [...], total: number, status: string }`

### Get Order by Code
- **GET** `/api/orders/code/:code`
- **Response**: `{ id: string, code: string, buyList: [...], total: number, status: string, ... }`

### Get Order by ID (Protected)
- **GET** `/api/orders/:id`
- **Auth**: Bearer token required
- **Response**: `{ id: string, code: string, buyList: [...], total: number, status: string, ... }`

### List All Orders (Protected)
- **GET** `/api/orders`
- **Auth**: Bearer token required
- **Response**: `[ { id: string, code: string, ... } ]`

### Update Order Status (Protected)
- **PATCH** `/api/orders/:id/status`
- **Auth**: Bearer token required
- **Body**: `{ status: 'pending' | 'paid' | 'delivered' | 'cancelled' }`
- **Response**: `{ id: string, code: string, status: string, ... }`

### Delete Order (Admin Only)
- **DELETE** `/api/orders/:id`
- **Auth**: Bearer token required (admin role)
- **Response**: `{ success: true, message: string }`

## Authentication Endpoints

### Register Cashier
- **POST** `/api/auth/register`
- **Body**: `{ email: string, password: string, name: string }`
- **Response**: `{ id: string, email: string, name: string, role: string }`

### Login Cashier
- **POST** `/api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id: string, email: string, name: string, role: string } }`

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": {}
  }
}
```

## Status Codes

- `201` - Created
- `200` - OK
- `400` - Validation Error
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
