import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { I18nProvider } from '@/lib/i18n-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ETAHA - Vehicle Parts & Maintenance',
  description: 'Quality vehicle parts and professional maintenance services',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var lang = localStorage.getItem('lang') || 'en';
                  
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                  
                  var direction = lang === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', 'ltr');
                  document.body && document.body.setAttribute('dir', 'ltr');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
