'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader as Loader2 } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getGuestCart, clearGuestCart } from '@/lib/guest-cart';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Merge guest cart with user cart
      await mergeGuestCart();
      
      toast.success(t('auth.login.success'));
      
      // Redirect based on query param
      const redirect = searchParams.get('redirect');
      if (redirect === 'cart') {
        router.push('/dashboard/cart');
      } else if (redirect === 'maintenance') {
        router.push('/dashboard/maintenance');
      } else if (redirect === 'orders') {
        router.push('/dashboard/orders');
      } else if (redirect === 'requests') {
        router.push('/dashboard/requests');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const mergeGuestCart = async () => {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For each guest cart item
      for (const guestItem of guestCart) {
        // Check if item already exists in user's cart
        const { data: existing } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', guestItem.productId)
          .maybeSingle();

        if (existing) {
          // Update quantity
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + guestItem.quantity })
            .eq('id', existing.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: guestItem.productId,
              quantity: guestItem.quantity
            });
        }
      }

      // Clear guest cart
      clearGuestCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error merging guest cart:', error);
      // Don't show error to user, cart merge is not critical
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <SiteNavbar />
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-4">
            <div className="mb-6 flex justify-center bg-transparent pl-8">
              <Image
                src="/color-text.png"
                alt="ETAHA Logo"
                width={144}
                height={179}
                className="h-auto w-36 bg-transparent dark:brightness-0 dark:invert"
                priority
              />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold text-card-foreground">{t('auth.login.title')}</CardTitle>
              <CardDescription className="text-base mt-2">
                {t('auth.login.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.login.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('auth.login.submit')
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('auth.login.signUp')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
