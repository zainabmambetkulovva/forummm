import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ForumsPage() {
  const t = useTranslations();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('forum.upcoming')}</h1>
        <p className="mt-2 text-muted-foreground">
          Просмотрите все доступные форумы и мероприятия
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder - будет заменено на реальные данные из API */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted" />
            <CardHeader>
              <CardTitle>Загрузка форумов...</CardTitle>
              <CardDescription>API будет подключен позже</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('forum.from')} - KGS</span>
                <Button size="sm">{t('common.viewDetails')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
