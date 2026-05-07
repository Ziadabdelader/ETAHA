'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, fullName, phone);
      toast.success(t('auth.register.success'));
    } catch (error: any) {
      toast.error(error.message || t('auth.register.error'));
    } finally {
      setLoading(false);
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
              <CardTitle className="text-3xl font-bold text-card-foreground">{t('auth.register.title')}</CardTitle>
              <CardDescription className="text-base mt-2">
                {t('auth.register.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.register.fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t('auth.register.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.register.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.register.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.register.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('auth.register.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.register.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.register.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                  minLength={6}
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
                  t('auth.register.submit')
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.register.hasAccount')}{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('auth.register.signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
