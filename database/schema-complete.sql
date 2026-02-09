-- Complete E-commerce Database Schema

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users viewable by self" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insertable by self" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Products viewable by all" ON products FOR SELECT USING (true);
CREATE POLICY "Orders viewable by owner" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Orders insertable by owner" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Order items viewable by order owner" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Cart viewable by owner" ON cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Cart insertable by owner" ON cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cart updatable by owner" ON cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Cart deletable by owner" ON cart FOR DELETE USING (auth.uid() = user_id);

-- Sample products
INSERT INTO products (name, description, price, image_url, stock, category) VALUES
('Chocolate Chip Cookies', 'Classic chocolate chip cookies', 12.99, '🍪', 100, 'cookies'),
('Oatmeal Raisin', 'Healthy and delicious', 10.99, '🥠', 80, 'cookies'),
('Double Chocolate', 'For chocolate lovers', 14.99, '🍫', 60, 'cookies'),
('Peanut Butter', 'Creamy peanut butter cookies', 11.99, '🌰', 90, 'cookies');
