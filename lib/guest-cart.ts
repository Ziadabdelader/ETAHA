// Guest cart management using localStorage

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_KEY = 'etaha_guest_cart';

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return [];
  }
}

export function setGuestCart(cart: GuestCartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    // Dispatch event for cart updates
    window.dispatchEvent(new Event('cart-updated'));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
}

export function addToGuestCart(productId: string, quantity: number = 1): void {
  const cart = getGuestCart();
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  setGuestCart(cart);
}

export function updateGuestCartQuantity(productId: string, quantity: number): void {
  const cart = getGuestCart();
  const item = cart.find(item => item.productId === productId);
  
  if (item) {
    item.quantity = quantity;
    setGuestCart(cart);
  }
}

export function removeFromGuestCart(productId: string): void {
  const cart = getGuestCart();
  const updatedCart = cart.filter(item => item.productId !== productId);
  setGuestCart(updatedCart);
}

export function clearGuestCart(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(GUEST_CART_KEY);
    window.dispatchEvent(new Event('cart-updated'));
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
}

export function getGuestCartCount(): number {
  const cart = getGuestCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
