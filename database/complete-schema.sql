-- ============================================
-- COMPLETE E-COMMERCE DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS POLICIES - USERS TABLE
-- ============================================

-- Users can view their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "users_select_admin" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update all users
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can delete users
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- 5. RLS POLICIES - PRODUCTS TABLE
-- ============================================

-- Anyone can view products
CREATE POLICY "products_select_all" ON products
  FOR SELECT
  USING (true);

-- Admins can insert products
CREATE POLICY "products_insert_admin" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update products
CREATE POLICY "products_update_admin" ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can delete products
CREATE POLICY "products_delete_admin" ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- 6. RLS POLICIES - CART TABLE
-- ============================================

-- Users can view their own cart
CREATE POLICY "cart_select_own" ON cart
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert to their own cart
CREATE POLICY "cart_insert_own" ON cart
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "cart_update_own" ON cart
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete from their own cart
CREATE POLICY "cart_delete_own" ON cart
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all carts
CREATE POLICY "cart_select_admin" ON cart
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- 7. RLS POLICIES - ORDERS TABLE
-- ============================================

-- Users can view their own orders
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update all orders
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can delete orders
CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- 8. RLS POLICIES - ORDER_ITEMS TABLE
-- ============================================

-- Users can view their own order items
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert their own order items
CREATE POLICY "order_items_insert_own" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "order_items_select_admin" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can update order items
CREATE POLICY "order_items_update_admin" ON order_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Admins can delete order items
CREATE POLICY "order_items_delete_admin" ON order_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- ============================================
-- 9. INSERT SAMPLE DATA
-- ============================================

INSERT INTO products (title, description, price, stock, image_url) VALUES
('Chocolate Chip Cookies', 'Classic chocolate chip cookies made with premium chocolate', 12.99, 100, '🍪'),
('Oatmeal Raisin Cookies', 'Healthy oatmeal cookies with sweet raisins', 10.99, 80, '🥠'),
('Double Chocolate Cookies', 'Rich double chocolate cookies for chocolate lovers', 14.99, 60, '🍫'),
('Peanut Butter Cookies', 'Creamy peanut butter cookies with crunchy texture', 11.99, 90, '🌰'),
('Sugar Cookies', 'Classic sugar cookies perfect for any occasion', 9.99, 120, '🍬'),
('Ginger Snap Cookies', 'Spicy ginger cookies with a crispy snap', 10.49, 70, '🫚');

-- ============================================
-- 10. HELPER FUNCTIONS (OPTIONAL)
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- All tables, keys, indexes, and RLS policies are now configured
