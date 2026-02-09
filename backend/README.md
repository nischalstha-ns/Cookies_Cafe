# Backend API Documentation

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`

3. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register user
- POST /api/auth/login - Login user
- GET /api/auth/verify - Verify token
- POST /api/auth/logout - Logout user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Add product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)
- POST /api/products/upload - Upload image (admin)

### Cart
- GET /api/cart - Get user cart
- POST /api/cart - Add to cart
- PUT /api/cart/:id - Update cart item
- DELETE /api/cart/:id - Remove from cart
- DELETE /api/cart - Clear cart

### Orders
- POST /api/orders/payment-intent - Create payment
- POST /api/orders - Create order
- GET /api/orders - Get user orders
- GET /api/orders/:id - Get order by ID
- GET /api/orders/admin/all - Get all orders (admin)
- PUT /api/orders/:id/status - Update status (admin)
