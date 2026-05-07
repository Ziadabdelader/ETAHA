'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { PreferenceToggles } from './preference-toggles';
import { Button } from './ui/button';

export function SiteNavbar() {
  const { t } = useTranslation();

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
            <div className="flex items-center gap-1 sm:gap-2">
              <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                <Link href="/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                <Link href="/register">{t('nav.register')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
