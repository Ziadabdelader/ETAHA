'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Chrome as Home, Package, Wrench, ClipboardList, Settings, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PreferenceToggles } from './preference-toggles';
import { useTranslation } from 'react-i18next';
import { getGuestCartCount } from '@/lib/guest-cart';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadCartCount();
  }, [user]);

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [user]);

  const loadCartCount = async () => {
    if (!user) {
      // Guest user - get from localStorage
      setCartCount(getGuestCartCount());
      return;
    }
    
    // Logged-in user - get from database
    const { data } = await supabase
      .from('cart_items')
      .select('quantity', { count: 'exact' })
      .eq('user_id', user.id);

    if (data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('nav.dashboard') },
    { href: '/dashboard/parts', icon: ShoppingCart, label: t('nav.parts') },
    { href: '/dashboard/maintenance', icon: Wrench, label: t('nav.maintenance') },
    { href: '/dashboard/orders', icon: Package, label: t('nav.orders') },
    { href: '/dashboard/requests', icon: ClipboardList, label: t('nav.requests') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="border-b bg-primary dark:bg-[#07212C] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={pathname === '/dashboard' ? '/' : '/dashboard'} className="flex items-center space-x-3">
              <Image src="/white-no-text.png" alt="ETAHA Logo" width={35} height={35} />
              <span className="text-xl font-bold text-white">{t('home.title')}</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="sm"
                    className={pathname === item.href 
                      ? 'bg-white text-black hover:bg-white/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90' 
                      : 'text-black hover:bg-white hover:text-black dark:text-white dark:hover:bg-accent dark:hover:text-accent-foreground'}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <PreferenceToggles />
              
              <Link href="/dashboard/cart">
                <Button variant="outline" size="icon" className="relative border-black bg-transparent text-black hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-accent dark:hover:text-accent-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-white text-primary dark:bg-primary dark:text-white">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hidden sm:inline-flex border-black bg-transparent text-black hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-accent dark:hover:text-accent-foreground">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden border-black bg-transparent text-black hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-accent dark:hover:text-accent-foreground" aria-label={t('aria.openMenu')}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>{t('nav.dashboard')}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={pathname === item.href ? 'default' : 'ghost'}
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                    <Link href="/dashboard/cart" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start relative">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t('nav.cart')}
                        {cartCount > 0 && (
                          <Badge className="ml-auto bg-primary">{cartCount}</Badge>
                        )}
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('nav.profile')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav.logout')}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
