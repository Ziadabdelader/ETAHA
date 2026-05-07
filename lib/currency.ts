/**
 * Format price in Egyptian Pounds (L.E.)
 * @param price - Price value
 * @param includeDecimals - Whether to show decimal places (default: true)
 * @returns Formatted price string
 */
export function formatPrice(price: number, includeDecimals: boolean = true): string {
  if (includeDecimals) {
    return `L.E. ${price.toFixed(2)}`;
  }
  return `L.E. ${Math.round(price)}`;
}

/**
 * Format price for display in tables/cards
 * @param price - Price value
 * @returns Formatted price string with 2 decimals
 */
export function formatCurrency(price: number): string {
  return formatPrice(price, true);
}

/**
 * Parse price from string (removes L.E. and converts to number)
 * @param priceString - Price string like "L.E. 12.00"
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace('L.E.', '').trim());
}
