# FORUM.KG - Статус разработки

**Дата:** 24 ноября 2026  
**Версия:** 0.1.0 (Начальная фаза)  
**Прогресс:** 5/10 задач завершено (50%)

---

## ✅ Завершенные задачи

### 1. Структура Monorepo (✓)
- ✅ Настроен pnpm workspace
- ✅ Создана структура проектов: `apps/` и `packages/`
- ✅ Настроены TypeScript конфигурации
- ✅ Добавлены скрипты сборки и разработки
- ✅ Настроены Prettier и ESLint

**Файлы:**
- `package.json` (root)
- `pnpm-workspace.yaml`
- `tsconfig.json`
- `.prettierrc`, `.gitignore`

---

### 2. Next.js Frontend (✓)
- ✅ Next.js 14 с App Router
- ✅ TypeScript настроен
- ✅ Tailwind CSS + shadcn/ui компоненты
- ✅ next-intl для мультиязычности (RU/KY/EN)
- ✅ Middleware для роутинга локалей
- ✅ Layout компоненты (Header, Footer, LocaleSwitcher)
- ✅ Главная страница с hero секцией
- ✅ Страница списка форумов
- ✅ Переводы на 3 языка

**Директория:** `apps/web/`

**Команды:**
```bash
pnpm dev:web     # Запуск в dev режиме
pnpm build:web   # Сборка для production
```

---

### 3. NestJS Backend (✓)
- ✅ NestJS с модульной архитектурой
- ✅ Swagger документация
- ✅ PrismaService для работы с БД
- ✅ Модули: Auth, Users, Forums, Orders, Payments, Tickets, Notifications
- ✅ JWT стратегия аутентификации
- ✅ Google OAuth стратегия
- ✅ Guards (JwtAuthGuard, RolesGuard)
- ✅ Decorators (@Roles)
- ✅ CRUD контроллеры и сервисы

**Директория:** `apps/api/`

**Команды:**
```bash
pnpm dev:api     # Запуск в dev режиме
pnpm build:api   # Сборка для production
```

**API Endpoints:**
- `GET /api/forums` - Список форумов
- `GET /api/forums/:id` - Детали форума
- `POST /api/auth/phone/send-otp` - Отправка OTP
- `POST /api/auth/phone/verify-otp` - Верификация OTP
- `GET /api/auth/me` - Текущий пользователь
- `GET /api/users/me` - Профиль пользователя
- `GET /api/tickets` - Мои билеты
- `GET /api/orders` - Мои заказы

**Swagger:** http://localhost:3001/api/docs

---

### 4. Prisma + Neon PostgreSQL (✓)
- ✅ Схема базы данных настроена
- ✅ Поддержка Neon Serverless PostgreSQL
- ✅ Seed скрипт с тестовыми данными
- ✅ SQL constraints для бизнес-правил
- ✅ Документация по настройке

**Директория:** `prisma/`

**Команды:**
```bash
pnpm db:generate        # Генерация Prisma Client
pnpm db:migrate         # Создание и применение миграций
pnpm db:seed           # Заполнение тестовыми данными
pnpm db:studio         # Prisma Studio GUI
```

**Тестовые данные после seed:**
- Admin: `+996700000000` (роль: SUPER_ADMIN)
- User: `+996700000001` (роль: USER)
- Форум: Tech Summit 2026 (500 мест)
- Категории: Standard (1500 KGS), VIP (3500 KGS)

---

### 5. Shared Types Package (✓)
- ✅ TypeScript типы для всех сущностей
- ✅ DTO с Zod валидацией
- ✅ Enums из Prisma схемы
- ✅ Validators и helpers
- ✅ Константы бизнес-правил
- ✅ Коды ошибок

**Директория:** `packages/shared-types/`

**Использование:**
```typescript
import { 
  Forum, 
  CreateOrderDto, 
  createOrderSchema,
  ForumStatus,
  formatPrice 
} from 'shared-types';
```

---

## 🚧 Задачи в разработке

### 6. Система аутентификации (Google OAuth + SMS) ⏳
**Статус:** Базовая структура создана, требуется реализация

**Что нужно сделать:**
- [ ] Интеграция SMS провайдера для OTP
- [ ] Реализация генерации и хеширования OTP
- [ ] Реализация верификации OTP с лимитами попыток
- [ ] Полная интеграция Google OAuth
- [ ] Связывание Google аккаунта с телефоном
- [ ] Компоненты аутентификации на фронтенде
- [ ] Страницы login/signup

**Файлы для работы:**
- `apps/api/src/modules/auth/`
- `apps/web/src/app/[locale]/auth/`

---

### 7. Публичные страницы (лендинг, форумы) ⏳
**Статус:** Базовая структура создана

**Что нужно сделать:**
- [ ] Подключение к API для загрузки форумов
- [ ] Страница деталей форума
- [ ] Отображение категорий билетов
- [ ] Показ доступности мест
- [ ] Фильтрация и поиск форумов
- [ ] Responsive дизайн для мобильных

**Файлы для работы:**
- `apps/web/src/app/[locale]/page.tsx`
- `apps/web/src/app/[locale]/forums/`

---

### 8. Личный кабинет пользователя 📋
**Что нужно сделать:**
- [ ] Дашборд с обзором
- [ ] Страница "Мои билеты"
- [ ] Страница "Мои заказы"
- [ ] История платежей
- [ ] Уведомления
- [ ] Настройки профиля
- [ ] Подключение Telegram

**Маршруты:**
- `/[locale]/account`
- `/[locale]/account/tickets`
- `/[locale]/account/orders`
- `/[locale]/account/payments`
- `/[locale]/account/notifications`
- `/[locale]/account/settings`

---

### 9. Админ-панель 📋
**Что нужно сделать:**
- [ ] Дашборд со статистикой
- [ ] Управление форумами (CRUD)
- [ ] Управление пользователями
- [ ] Просмотр заказов и платежей
- [ ] Обработка запросов на отмену
- [ ] QR-сканер для входа
- [ ] Настройки сайта
- [ ] Мониторинг интеграций
- [ ] Аудит лог

**Маршруты:**
- `/[locale]/admin`
- `/[locale]/admin/forums`
- `/[locale]/admin/orders`
- `/[locale]/admin/users`
- `/[locale]/admin/settings`
- `/[locale]/admin/scanner`

---

### 10. Покупка билетов 📋
**Что нужно сделать:**
- [ ] Корзина и выбор билетов
- [ ] Форма данных участников
- [ ] Временная резервация мест
- [ ] Интеграция Finik для оплаты
- [ ] Webhook для подтверждения платежа
- [ ] Генерация QR-билетов
- [ ] Шифрование QR токенов
- [ ] Отправка билетов в Telegram
- [ ] Проверка лимитов на аккаунт
- [ ] Atomic операции для capacity

**Ключевые файлы:**
- `apps/api/src/modules/orders/`
- `apps/api/src/modules/payments/`
- `apps/api/src/modules/tickets/`
- `apps/web/src/app/[locale]/checkout/`

---

## 🔧 Следующие шаги

### Немедленные действия

1. **Установка зависимостей:**
```bash
pnpm install
```

2. **Настройка БД (Neon):**
   - Создать проект в https://console.neon.tech/
   - Скопировать connection strings
   - Настроить `prisma/.env`
   - Запустить: `pnpm db:migrate`
   - Заполнить: `pnpm db:seed`

3. **Настройка переменных окружения:**
   - Frontend: `apps/web/.env.local`
   - Backend: `apps/api/.env`
   - Использовать `.env.example` как шаблон

### Приоритет разработки

**Фаза 1: Аутентификация (1-2 недели)**
- Выбрать и интегрировать SMS провайдера
- Реализовать полный flow OTP
- Завершить Google OAuth
- Создать UI для auth

**Фаза 2: Публичные страницы (1 неделя)**
- API для списка форумов
- Страница деталей форума
- Проверка доступности мест

**Фаза 3: Покупка билетов (2-3 недели)**
- Корзина и checkout flow
- Интеграция Finik
- Генерация QR-билетов
- Telegram доставка

**Фаза 4: Личный кабинет (1 неделя)**
- Дашборд
- Мои билеты
- Мои заказы

**Фаза 5: Админ-панель (2 недели)**
- CRUD форумов
- Управление заказами
- QR-сканер
- Статистика

---

## 📦 Структура проекта

```
forum-kg/
├── apps/
│   ├── web/              ✅ Next.js фронтенд
│   ├── api/              ✅ NestJS API
│   └── worker/           📋 BullMQ worker (TODO)
├── packages/
│   ├── shared-types/     ✅ Общие типы
│   ├── api-client/       📋 API клиент (TODO)
│   └── config/           📋 Конфиг (TODO)
├── prisma/               ✅ База данных
│   ├── schema.prisma
│   ├── seed.ts
│   └── docs/
└── package.json
```

---

## 🔗 Интеграции (TODO)

### Требуют настройки:
- [ ] **Finik** - платежный провайдер
- [ ] **SMS Provider** - верификация телефона (выбрать провайдера)
- [ ] **Google OAuth** - credentials настроить
- [ ] **Telegram Bot** - создать бота и получить token
- [ ] **S3 Storage** - для загрузки изображений
- [ ] **Redis** - для очередей и кеша
- [ ] **Sentry** - мониторинг ошибок

---

## 📚 Документация

- **Общая:** `README.md`
- **БД:** `prisma/README.md`, `prisma/docs/setup.md`
- **Shared Types:** `packages/shared-types/README.md`
- **API:** http://localhost:3001/api/docs (Swagger)

---

## 🛠️ Полезные команды

```bash
# Разработка
pnpm dev              # Все приложения
pnpm dev:web          # Только фронтенд
pnpm dev:api          # Только API

# База данных
pnpm db:generate      # Генерация Prisma Client
pnpm db:migrate       # Миграции
pnpm db:seed          # Тестовые данные
pnpm db:studio        # GUI для БД

# Сборка
pnpm build            # Все приложения
pnpm build:web        # Только фронтенд
pnpm build:api        # Только API

# Линтинг
pnpm lint             # Проверка кода
pnpm format           # Форматирование кода
```

---

## ⚠️ Важные замечания

1. **Не коммитьте `.env` файлы!** Используйте `.env.example`
2. **Monetary values** в minor units (tyiyn): 1 KGS = 100 tyiyn
3. **Timestamps** хранятся в UTC, отображаются в Asia/Bishkek
4. **Phone numbers** в E.164 формате: `+996700123456`
5. **Email** нормализованы в lowercase

---

## 🎯 Готовность к запуску

**Backend API:** ⚠️ Частично (требует настройки интеграций)  
**Frontend:** ⚠️ Частично (базовая структура готова)  
**База данных:** ✅ Готово (после миграции)  
**Аутентификация:** ⚠️ Требует реализации  
**Платежи:** ❌ Не реализовано  

---

**Следующий шаг:** Выбрать SMS провайдера и реализовать полную аутентификацию

**Вопросы?** Смотрите документацию в соответствующих README файлах
