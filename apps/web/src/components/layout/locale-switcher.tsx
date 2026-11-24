'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const locales = [
  { code: 'ru', label: 'RU' },
  { code: 'ky', label: 'KY' },
  { code: 'en', label: 'EN' },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex gap-1 border rounded-md p-1">
      {locales.map(loc => (
        <Button
          key={loc.code}
          variant={locale === loc.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLocaleChange(loc.code)}
          className="h-7 px-2 text-xs"
        >
          {loc.label}
        </Button>
      ))}
    </div>
  );
}
