/*
  # Add Payment Details to Orders

  Adds a payment_details JSONB column to the orders table to store
  demo card payment information (masked card number, cardholder name,
  payment method type).

  NOTE: This is a demo implementation. No real card processing occurs.
  Only the last 4 digits of the card number are stored.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cash',
  ADD COLUMN IF NOT EXISTS payment_details jsonb;
