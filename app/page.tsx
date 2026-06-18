'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Wrench, Package, Users } from 'lucide-react';
import { SiteNavbar } from '@/components/site-navbar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  const scrollToBottom = () => {
    const start = window.pageYOffset;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    const distance = end - start;
    const duration = 1000; // 1.5 seconds
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, start + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SiteNavbar />
      

      {/* ================= HERO ================= */}
<section className="relative min-h-[640px] md:min-h-[760px] w-full overflow-visible">

  {/* BACKGROUND */}
  <Image
    src="/bg.png"
    alt="Background"
    fill
    className="object-cover"
    priority
  />

  {/* LIGHT OVERLAY */}
  <div className="absolute inset-0 bg-background/60 dark:bg-background/40"></div>

  {/* TEXT */}
  <div className="relative z-20 max-w-7xl mx-auto min-h-[640px] md:min-h-[760px] flex items-start md:items-center px-6 pt-16 md:pt-0 pointer-events-none">
    <div className="max-w-lg">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-snug">
        {t('home.subtitle')}
      </h1>

      <p className="text-base text-muted-foreground mb-8 md:mb-0">
        {t('home.description')}
      </p>
    </div>
  </div>

  {/* VAN WITH BUTTONS */}
  <div className="absolute inset-x-0 top-[280px] md:top-auto md:bottom-24 z-30 flex justify-center md:justify-start md:left-[50%] overflow-visible px-4 md:px-8">
    <div className="relative pointer-events-auto w-[92vw] max-w-[700px] aspect-[1289/1221]">
      {/* Van Images */}
      <div className="relative group cursor-pointer w-full h-full">
        {/* Closed Van - Default */}
        <Image
          src="/closed-van-v2.png"
          alt="Van"
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 58vw, 700px"
          className="object-contain object-bottom transition-opacity duration-300 group-hover:opacity-0"
          priority
        />
        {/* Opened Van - On Hover */}
        <Image
          src="/opened-van.png"
          alt="Van Open"
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 58vw, 700px"
          className="object-contain object-bottom opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* BUTTONS - Positioned relative to van at the end of the light beam */}
      <div className="absolute left-[15%] bottom-[16%] flex gap-2 md:gap-6 pointer-events-auto">
        <Link href="/dashboard/parts">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 md:px-8 md:py-4 text-xs md:text-lg shadow-2xl rounded-lg md:rounded-xl whitespace-nowrap">
            {t('home.getStarted')}
          </Button>
        </Link>

        <Button 
          variant="secondary" 
          className="px-3 py-2 md:px-8 md:py-4 text-xs md:text-lg shadow-2xl rounded-lg md:rounded-xl whitespace-nowrap"
          onClick={scrollToBottom}
        >
          {t('home.learnMore')}
        </Button>
      </div>
    </div>
  </div>

</section>

{/* ================= FEATURES STRIP ================= */}
<section className="bg-muted py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">

    <div>
      <Package className="mx-auto text-primary mb-2" size={32}/>
      <p className="font-semibold text-foreground">{t('home.features.parts.title')}</p>
      <p className="text-sm text-muted-foreground">{t('home.features.parts.description')}</p>
    </div>

    <div>
      <Wrench className="mx-auto text-primary mb-2" size={32}/>
      <p className="font-semibold text-foreground">{t('home.features.maintenance.title')}</p>
      <p className="text-sm text-muted-foreground">{t('home.features.maintenance.description')}</p>
    </div>

    <div>
      <ShoppingCart className="mx-auto text-primary mb-2" size={32}/>
      <p className="font-semibold text-foreground">{t('home.features.tracking.title')}</p>
      <p className="text-sm text-muted-foreground">{t('home.features.tracking.description')}</p>
    </div>

    <div>
      <Users className="mx-auto text-primary mb-2" size={32}/>
      <p className="font-semibold text-foreground">{t('home.features.title')}</p>
      <p className="text-sm text-muted-foreground">{t('home.description')}</p>
    </div>

  </div>
</section>

{/* ================= SERVICES ================= */}
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">

    <h2 className="text-4xl font-bold text-center text-foreground mb-12">
      {t('home.features.title')}
    </h2>

    <div className="grid md:grid-cols-2 gap-8">

      {/* ORDER */}
      <Card className="bg-card border shadow-md">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                {t('nav.parts')}
              </h3>

              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>{t('parts.search')}</li>
                <li>{t('cart.checkout')}</li>
                <li>{t('home.features.tracking.description')}</li>
              </ul>

              <Link href="/dashboard/parts">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t('nav.parts')}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAINTENANCE */}
      <Card className="bg-card border shadow-md">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="bg-secondary/50 p-4 rounded-xl">
              <Wrench className="h-8 w-8 text-secondary-foreground" />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                {t('nav.maintenance')}
              </h3>

              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>{t('maintenance.schedule')}</li>
                <li>{t('home.features.maintenance.description')}</li>
                <li>{t('maintenance.date')}</li>
              </ul>

              <Link href="/dashboard/maintenance">
                <Button variant="secondary">
                  {t('maintenance.schedule')}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</section>

{/* ================= FOOTER ================= */}
<footer className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4">
  <div className="max-w-7xl mx-auto text-center">

    <div className="flex justify-center items-center gap-3 mb-6">
      <Image
        src="/white-no-text.png"
        alt="ETAHA Logo"
        width={42}
        height={42}
        className="dark:hidden"
      />
      <Image
        src="/black-no-text.png"
        alt="ETAHA Logo"
        width={42}
        height={42}
        className="hidden dark:block"
      />
      <span className="text-2xl font-bold">{t('home.title')}</span>
    </div>

    <p className="text-primary-foreground/80 mb-4">
      {t('home.subtitle')}
    </p>

    <p className="text-sm text-primary-foreground/60">
      © {new Date().getFullYear()} {t('home.title')}. All rights reserved.
    </p>

  </div>
</footer>
</div>
  );
}
