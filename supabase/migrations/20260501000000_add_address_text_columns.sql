-- Add address_text column to orders table to store address snapshot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_text TEXT;

-- Add address_text column to maintenance_requests table to store address snapshot
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS address_text TEXT;

-- Update existing orders with current address text (if address still exists)
UPDATE orders o
SET address_text = CONCAT(a.address_line1, ', ', a.city, ', ', a.postal_code)
FROM addresses a
WHERE o.address_id = a.id AND o.address_text IS NULL;

-- Update existing maintenance requests with current address text (if address still exists)
UPDATE maintenance_requests mr
SET address_text = CONCAT(a.address_line1, ', ', a.city, ', ', a.postal_code)
FROM addresses a
WHERE mr.address_id = a.id AND mr.address_text IS NULL;
