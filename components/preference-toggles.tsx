'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function PreferenceToggles() {
  const { i18n, t } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        aria-label={t('aria.toggleLanguage')}
        className="font-semibold"
      >
        {i18n.language === 'en' ? 'AR' : 'EN'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label={t('aria.toggleDarkMode')}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
