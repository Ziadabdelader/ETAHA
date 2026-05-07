'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Wrench, Package, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('dashboard.welcome')}</h1>
          <p className="text-lg text-muted-foreground">{t('dashboard.overview')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/dashboard/parts">
            <Card className="border-2 border-primary hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t('nav.parts')}</CardTitle>
                <CardDescription className="text-base">
                  {t('parts.title')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t('cart.browseParts')}
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/maintenance">
            <Card className="border-2 border-primary hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t('nav.maintenance')}</CardTitle>
                <CardDescription className="text-base">
                  {t('maintenance.title')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t('maintenance.schedule')}
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/dashboard/orders">
            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-card-foreground">{t('orders.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('orders.noOrdersDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/requests">
            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-card-foreground">{t('requests.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('requests.noRequestsDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
