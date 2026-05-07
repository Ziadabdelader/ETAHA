'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  address_text: string;
  address: {
    address_line1: string;
    city: string;
    postal_code: string;
  } | null;
  order_items: Array<{
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }>;
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        notes,
        created_at,
        address_text,
        address:addresses(address_line1, city, postal_code),
        order_items(
          quantity,
          price,
          product:products(name)
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('orders.pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('orders.pageDescription')}</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('orders.noOrders')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('orders.noOrdersDescription')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{t('orders.orderNumber')} #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(order.created_at), 'PPP')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {t(`orders.statuses.${order.status}`).toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.address_text || (order.address ? `${order.address.address_line1}, ${order.address.city} ${order.address.postal_code}` : t('orders.addressDeleted'))}
                      </span>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">{t('orders.itemsOrdered')}</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-slate-700">
                              {item.quantity}x {item.product.name}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              L.E. {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-slate-900 dark:text-white text-sm">{t('orders.notesLabel')}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{order.notes}</p>
                      </div>
                    )}

                    <div className="border-t pt-4 flex items-center justify-between">
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">{t('orders.total')}:</span>
                      <span className="text-2xl font-bold text-[#0d5a7d]">
                        L.E. {order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
