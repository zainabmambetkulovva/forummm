'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from './locale-switcher';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('site.name')}
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/${locale}/forums`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('nav.forums')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Button asChild variant="ghost">
            <Link href={`/${locale}/auth/signin`}>{t('nav.login')}</Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/auth/signup`}>{t('nav.register')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
