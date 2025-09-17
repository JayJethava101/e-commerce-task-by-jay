# E-commerce Project Documentation

## Project Overview

This project is a Node.js-based e-commerce backend that manages products, users, orders, and order items. It uses Sequelize ORM for database operations and follows a modular structure for scalability and maintainability.

## Project Structure

- `app.js` / `server.js`: Application entry points
- `modules/`: Contains business logic for each domain
  - `product/`: Product management (CRUD, stock)
  - `order/`: Order management (creation, cancellation, details)
  - `orderItem/`: Order item management
  - `user/`: User management
- `routes/`: API route definitions
- `middleware/`: Authentication and other middleware
- `utils/`: Utility functions (e.g., database connection)

## Setup Instructions

1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure your database in `utils/db.js`.
3. Start the server:
   ```sh
   node server.js
   ```

## Authentication & Authorization

### Authentication

- **Signup:**
  - Endpoint: `POST /users/signup`
  - Hashes password with bcrypt and stores user in DB.
- **Login:**
  - Endpoint: `POST /users/login`
  - Verifies credentials, returns a JWT token if valid.
- **JWT:**
  - All protected routes require a JWT in the `Authorization: Bearer <token>` header.
  - The token contains user id, email, and role, and is verified using a secret key.
- **Middleware:**
  - `authMiddleware` (in `middleware/auth.js`) checks for a valid JWT, attaches user info to `req.user`.

### Authorization

- **Role-based:**
  - `roleMiddleware([roles])` restricts access to certain endpoints based on user role (e.g., `admin`).
  - Example: Only admins can create products or update order status.
- **Usage in routes:**
  - All `/orders` and `/products` routes require authentication.
  - Creating a product or updating order status requires `admin` role.

## Order Management & Stock Adjustment

### Order Creation

- Endpoint: `POST /orders`
- Flow:
  1. Receives order data (list of products and quantities).
  2. For each product, checks stock using `checkProductStock` (in `modules/product/service.js`).
  3. If all products have sufficient stock, creates an order and order items.
  4. **Stock is adjusted automatically** after each order item is saved, via a Sequelize `afterSave` hook in `modules/orderItem/model.js`:
     - Calls `adjustProductStock` with a negative quantity to decrement stock.

### Order Cancellation

- Endpoint: `POST /orders/:id/cancel`
- Flow:
  1. Finds the order and verifies user authorization.
  2. Updates order status to `cancelled`.
  3. For each order item, **restores stock** by calling `adjustProductStock` with a positive quantity (in `modules/order/service.js`).

### Stock Adjustment Logic

- **Decrease stock:**
  - Triggered by the `afterSave` hook in `OrderItem` model after order item creation.
  - Calls `adjustProductStock(productId, -quantity)`.
- **Increase stock (on cancel):**
  - Triggered in `cancelOrder` service.
  - Calls `adjustProductStock(productId, quantity)` for each item.
- **Stock check:**
  - `checkProductStock(productId, quantity)` ensures enough stock before order is placed.

#### Key Files

- `modules/order/service.js`: Orchestrates order creation and cancellation, calls stock functions.
- `modules/orderItem/model.js`: Contains the `afterSave` hook for automatic stock decrement.
- `modules/product/service.js`: Implements `checkProductStock` and `adjustProductStock`.

## Notes

- Stock is always checked before order placement.
- Stock is decremented only after order item is saved.
- Cancelling an order restores the stock for each product in the order.

---
