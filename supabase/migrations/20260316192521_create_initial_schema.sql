/*
  # ETAHA Initial Database Schema

  ## Tables Created
  
  1. profiles
    - id (uuid, references auth.users)
    - full_name (text)
    - phone (text)
    - created_at (timestamptz)
    - updated_at (timestamptz)
  
  2. addresses
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - address_line1 (text)
    - address_line2 (text)
    - city (text)
    - postal_code (text)
    - is_default (boolean)
    - created_at (timestamptz)
  
  3. categories
    - id (uuid, primary key)
    - name (text)
    - description (text)
    - created_at (timestamptz)
  
  4. products
    - id (uuid, primary key)
    - category_id (uuid, references categories)
    - name (text)
    - description (text)
    - price (decimal)
    - stock_quantity (integer)
    - image_url (text)
    - is_available (boolean)
    - created_at (timestamptz)
  
  5. cart_items
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - product_id (uuid, references products)
    - quantity (integer)
    - created_at (timestamptz)
  
  6. orders
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - address_id (uuid, references addresses)
    - total_amount (decimal)
    - status (text)
    - notes (text)
    - created_at (timestamptz)
    - updated_at (timestamptz)
  
  7. order_items
    - id (uuid, primary key)
    - order_id (uuid, references orders)
    - product_id (uuid, references products)
    - quantity (integer)
    - price (decimal)
    - created_at (timestamptz)
  
  8. maintenance_requests
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - address_id (uuid, references addresses)
    - service_type (text)
    - preferred_date (date)
    - preferred_time (text)
    - description (text)
    - status (text)
    - include_parts (boolean)
    - created_at (timestamptz)
    - updated_at (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  postal_code text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  address_id uuid REFERENCES addresses(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  include_parts boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own maintenance requests"
  ON maintenance_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own maintenance requests"
  ON maintenance_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance requests"
  ON maintenance_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
