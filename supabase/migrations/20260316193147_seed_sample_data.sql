/*
  # Seed Sample Data

  ## Sample Data Added
  
  1. Categories
    - Wheels & Tires
    - Cushions & Seating
    - Brakes & Axles
    - Accessories
  
  2. Products
    - Various wheelchair parts with prices and stock
*/

-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Wheels & Tires', 'High-quality wheels and tire replacements for all wheelchair types'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Cushions & Seating', 'Comfortable and supportive seating solutions'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Brakes & Axles', 'Essential brake and axle components'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Accessories', 'Useful accessories to enhance your wheelchair')
ON CONFLICT (id) DO NOTHING;

-- Insert Products
INSERT INTO products (name, description, price, stock_quantity, category_id, is_available) VALUES
  ('Premium Pneumatic Tire 24"', 'Durable pneumatic tire with excellent grip and smooth ride', 89.99, 45, '550e8400-e29b-41d4-a716-446655440001', true),
  ('Solid Polyurethane Tire 22"', 'Maintenance-free solid tire, puncture-proof design', 69.99, 32, '550e8400-e29b-41d4-a716-446655440001', true),
  ('Quick Release Wheel Set', 'Easy-to-remove wheel set for transport convenience', 249.99, 18, '550e8400-e29b-41d4-a716-446655440001', true),
  ('Gel Wheelchair Cushion', 'Pressure-relieving gel cushion for maximum comfort', 129.99, 28, '550e8400-e29b-41d4-a716-446655440002', true),
  ('Memory Foam Seat Cushion', 'Ergonomic memory foam provides superior support', 79.99, 42, '550e8400-e29b-41d4-a716-446655440002', true),
  ('Backrest Support Pad', 'Adjustable lumbar support for enhanced comfort', 59.99, 36, '550e8400-e29b-41d4-a716-446655440002', true),
  ('Drum Brake Assembly', 'High-performance drum brake system', 149.99, 15, '550e8400-e29b-41d4-a716-446655440003', true),
  ('Quick-Stop Brake Lever', 'Easy-to-use brake lever with ergonomic design', 34.99, 52, '550e8400-e29b-41d4-a716-446655440003', true),
  ('Heavy-Duty Axle Set', 'Reinforced axle for enhanced durability', 119.99, 22, '550e8400-e29b-41d4-a716-446655440003', true),
  ('Cup Holder Attachment', 'Universal cup holder fits most wheelchairs', 19.99, 68, '550e8400-e29b-41d4-a716-446655440004', true),
  ('Storage Bag with Pockets', 'Multi-compartment storage solution', 39.99, 44, '550e8400-e29b-41d4-a716-446655440004', true),
  ('LED Safety Light Set', 'Front and rear LED lights for visibility', 29.99, 55, '550e8400-e29b-41d4-a716-446655440004', true),
  ('Comfort Armrest Pads', 'Soft padded armrests for extended comfort', 44.99, 38, '550e8400-e29b-41d4-a716-446655440004', true),
  ('Anti-Tip Wheel Kit', 'Safety anti-tip wheels for stability', 54.99, 26, '550e8400-e29b-41d4-a716-446655440004', true),
  ('Spoke Guards (Pair)', 'Decorative and protective spoke guards', 24.99, 48, '550e8400-e29b-41d4-a716-446655440001', true)
ON CONFLICT DO NOTHING;
