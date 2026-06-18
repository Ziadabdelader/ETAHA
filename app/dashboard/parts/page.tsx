'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { addToGuestCart } from '@/lib/guest-cart';

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  price: number;
  stock_quantity: number;
  image_url: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string | null;
}

export default function PartsPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data regardless of auth status
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadCategories()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error) {
      toast.error(t('parts.loadProductsError'));
    } else {
      setProducts(data || []);
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      toast.error(t('parts.loadCategoriesError'));
    } else {
      setCategories(data || []);
    }
  };

  const addToCart = async (productId: string) => {
    // Get the product to check stock
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Guest user - use local storage
    if (!user) {
      addToGuestCart(productId, 1);
      toast.success(t('parts.addedToCart'));
      return;
    }

    // Logged in user - use database
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      // Check if we can add one more
      if (existing.quantity >= product.stock_quantity) {
        toast.error(t('parts.outOfStock'));
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);

      if (error) {
        toast.error(t('parts.updateCartError'));
      } else {
        toast.success(t('parts.cartUpdated'));
        window.dispatchEvent(new Event('cart-updated'));
      }
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);

      if (error) {
        toast.error(t('parts.addToCartError'));
      } else {
        toast.success(t('parts.addedToCart'));
        window.dispatchEvent(new Event('cart-updated'));
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isArabic && (product.name_ar?.includes(searchQuery) || product.description_ar?.includes(searchQuery)));
    return matchesCategory && matchesSearch;
  });

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('parts.pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('parts.pageDescription')}</p>
        </div>

        <div className="mb-6 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder={t('parts.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t('parts.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('parts.allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {isArabic && category.name_ar ? category.name_ar : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('parts.noResults')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('parts.noResultsDescription')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-56 bg-white flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={isArabic && product.name_ar ? product.name_ar : product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-slate-300" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isArabic && product.name_ar ? product.name_ar : product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {isArabic && product.description_ar
                      ? product.description_ar
                      : product.description || t('parts.noDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      L.E. {product.price.toFixed(2)}
                    </span>
                    <Badge variant={product.stock_quantity > 0 ? 'default' : 'secondary'}>
                      {product.stock_quantity > 0 ? t('parts.stockCount', { count: product.stock_quantity }) : t('parts.outOfStock')}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('parts.addToCart')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
