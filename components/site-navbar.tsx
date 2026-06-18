'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { PreferenceToggles } from './preference-toggles';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth-context';
import { ShoppingCart, Package, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getGuestCartCount } from '@/lib/guest-cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SiteNavbar() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [user]);

  const loadCartCount = async () => {
    if (!user) {
      // Guest user - get count from localStorage
      setCartCount(getGuestCartCount());
      return;
    }
    
    // Logged-in user - get count from database
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity', { count: 'exact' })
      .eq('user_id', user.id);

    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image src="/color-no-text.png" alt="ETAHA Logo" width={28} height={28} className="dark:hidden" />
            <Image src="/white-no-text.png" alt="ETAHA Logo" width={35} height={35} className="hidden dark:block" />
            <span className="text-lg sm:text-xl font-bold text-primary">{t('home.title')}</span>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-4">
            <PreferenceToggles />
            
            {!loading && (
              <>
                {user ? (
                  // Logged in user navigation
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                      <Link href="/dashboard/parts">
                        <Package className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t('nav.parts')}</span>
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4 relative">
                      <Link href="/dashboard/cart">
                        <ShoppingCart className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t('nav.cart')}</span>
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                          <User className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">{t('nav.profile')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>{t('nav.profile')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            {t('nav.dashboard')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile" className="cursor-pointer">
                            {t('profile.title')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/orders" className="cursor-pointer">
                            {t('nav.orders')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/requests" className="cursor-pointer">
                            {t('nav.requests')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                          <LogOut className="h-4 w-4 mr-2" />
                          {t('nav.logout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  // Guest user navigation
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                      <Link href="/login">{t('nav.login')}</Link>
                    </Button>
                    <Button asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                      <Link href="/register">{t('nav.register')}</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
