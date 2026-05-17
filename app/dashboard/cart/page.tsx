'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/dashboard-layout';
import { CheckoutFlow } from '@/components/checkout-flow';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/currency';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    image_url: string;
  };
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  location_link?: string;
  is_default: boolean;
}

export default function CartPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadCart();
      loadAddresses();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products!inner(id, name, price, stock_quantity, image_url)
      `)
      .eq('user_id', user?.id);

    if (error) {
      toast.error(t('cart.removeError'));
    } else {
      setCartItems(data as any || []);
    }
    setLoading(false);
  };

  const loadAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Find the cart item to check stock
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem) return;

    // Check if new quantity exceeds stock
    if (newQuantity > cartItem.product.stock_quantity) {
      toast.error(t('parts.outOfStock'));
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (error) {
      toast.error(t('cart.removeError'));
    } else {
      loadCart();
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast.error(t('cart.removeError'));
    } else {
      toast.success(t('cart.removeSuccess'));
      loadCart();
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleAddAddress = async (address: Omit<Address, 'id' | 'is_default'>): Promise<Address> => {
    if (!user) {
      throw new Error('User is required to add an address');
    }

    const addressPayload = {
      user_id: user.id,
      address_line1: address.address_line1.trim(),
      address_line2: address.address_line2?.trim() || null,
      city: address.city.trim(),
      postal_code: address.postal_code.trim(),
      location_link: address.location_link?.trim() || null,
      is_default: false,
    };

    const { data, error } = await supabase
      .from('addresses')
      .insert([addressPayload])
      .select()
      .single();

    if (error) {
      console.error('Address creation error:', { error, addressPayload });
      throw error;
    }

    setAddresses((current) => [data as Address, ...current]);
    return data as Address;
  };

  const handlePlaceOrder = async (data: {
    addressId: string;
    paymentMethod: 'cash' | 'online';
    notes: string;
    cardDetails?: {
      cardholderName: string;
      lastFour: string;
      expiryMonth: string;
      expiryYear: string;
    };
  }): Promise<{ success: boolean; orderId?: string }> => {
    try {
      // Validate stock availability before placing order
      for (const item of cartItems) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product.id)
          .single();

        if (productError || !product) {
          toast.error(t('cart.orderError'));
          return { success: false };
        }

        if (product.stock_quantity < item.quantity) {
          toast.error(`${item.product.name} - ${t('parts.outOfStock')}`);
          loadCart(); // Reload cart to show updated stock
          return { success: false };
        }
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Find the selected address to save its snapshot
      const selectedAddress = addresses.find(a => a.id === data.addressId);
      if (!selectedAddress) {
        toast.error(t('cart.checkoutFlow.selectAddress'));
        return { success: false };
      }

      // Create address snapshot text
      const addressText = `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}, ${selectedAddress.city}, ${selectedAddress.postal_code}`;

      const orderPayload: Record<string, any> = {
        user_id: user?.id,
        address_id: data.addressId,
        address_text: addressText,
        total_amount: totalAmount,
        status: 'pending',
        notes: data.notes || null,
        payment_method: data.paymentMethod,
        // Store only masked card info — never store full card numbers
        payment_details: data.paymentMethod === 'online' && data.cardDetails
          ? {
              cardholder_name: data.cardDetails.cardholderName,
              last_four: data.cardDetails.lastFour,
              expiry: `${data.cardDetails.expiryMonth}/${data.cardDetails.expiryYear}`,
              status: 'paid',
            }
          : null,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', { orderError, orderPayload });
        throw orderError;
      }

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        throw itemsError;
      }

      // Update stock quantities for each product
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .rpc('decrease_product_stock', {
            product_id: item.product.id,
            quantity_to_decrease: item.quantity
          });

        if (stockError) {
          console.error('Stock update error:', stockError);
          // Continue with order even if stock update fails
        }
      }

      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id);

      if (cartError) {
        console.error('Cart clear error:', cartError);
        throw cartError;
      }

      window.dispatchEvent(new Event('cart-updated'));
      router.push('/dashboard/orders');
      return { success: true, orderId: order.id };
    } catch (error: any) {
      console.error('Order placement error:', error);
      if (error?.message) {
        toast.error(`Order failed: ${error.message}`);
      }
      return { success: false };
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('cart.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {cartItems.length} {t('cart.checkoutFlow.items')}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('cart.empty')}</h3>
              <p className="text-muted-foreground mb-6">{t('cart.emptyDescription')}</p>
              <Button onClick={() => router.push('/dashboard/parts')}>
                {t('cart.browseParts')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{item.product.name}</h3>
                        <p className="text-2xl font-bold text-primary mt-1">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="sticky bottom-4 shadow-lg border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-semibold text-foreground">{t('cart.total')}:</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-12 text-lg"
                >
                  {t('cart.checkout')}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        <CheckoutFlow
          open={showCheckout}
          onOpenChange={setShowCheckout}
          cartItems={cartItems}
          addresses={addresses}
          onAddAddress={handleAddAddress}
          onPlaceOrder={handlePlaceOrder}
          onUpdateQuantity={async (itemId: string, newQuantity: number) => {
            await updateQuantity(itemId, newQuantity);
          }}
          onRemoveItem={async (itemId: string) => {
            await removeItem(itemId);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
