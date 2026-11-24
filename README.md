# FORUM.KG

Платформа для публикации форумов, продажи билетов и управления входом на мероприятия в Кыргызстане.

## 🏗️ Архитектура

Проект организован как pnpm monorepo с модульной монолитной архитектурой:

```
forum-kg/
├── apps/
│   ├── web/           # Next.js: фронтенд приложение
│   ├── api/           # NestJS: REST API backend
│   └── worker/        # BullMQ: фоновые задачи
├── packages/
│   ├── shared-types/  # Общие TypeScript типы
│   ├── api-client/    # API клиент для фронтенда
│   └── config/        # Общая конфигурация
└── prisma/            # Схема базы данных
```

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** (App Router) - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **shadcn/ui** - компоненты UI
- **next-intl** - интернационализация (RU/KY/EN)
- **TanStack Query** - управление данными
- **React Hook Form + Zod** - формы и валидация

### Backend
- **NestJS** - Node.js фреймворк
- **TypeScript** - типизация
- **Prisma ORM** - работа с БД
- **Neon Serverless PostgreSQL** - база данных
- **Redis + BullMQ** - очереди и кэш
- **Swagger** - документация API

### Интеграции
- **Finik** - платежный провайдер
- **Google OAuth** - аутентификация
- **Telegram Bot API** - доставка билетов
- **SMS Provider** - верификация телефона

## 🚀 Быстрый старт

### Требования
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL (Neon) аккаунт

### Установка

```bash
# Установить зависимости
pnpm install

# Настроить переменные окружения
cp .env.example .env
# Заполните .env файл вашими credentials

# Применить миграции базы данных
pnpm prisma migrate dev

# Запустить в режиме разработки
pnpm dev
```

### Доступные команды

```bash
# Разработка
pnpm dev              # Запустить все приложения
pnpm dev:web          # Только фронтенд
pnpm dev:api          # Только API

# Сборка
pnpm build            # Собрать все приложения
pnpm build:web        # Только фронтенд
pnpm build:api        # Только API

# Линтинг и форматирование
pnpm lint             # Проверить код
pnpm format           # Форматировать код

# База данных
pnpm prisma studio    # Открыть Prisma Studio
pnpm prisma generate  # Генерировать Prisma Client
```

## 📝 Основные функции

- ✅ Публикация и управление форумами
- ✅ Регистрация через Google + верификация телефона
- ✅ Покупка билетов (Standard/VIP категории)
- ✅ Интеграция платежей через Finik
- ✅ Генерация уникальных QR-билетов
- ✅ Доставка билетов в Telegram
- ✅ QR-сканер для входа на мероприятия
- ✅ Система уведомлений
- ✅ Мультиязычность (RU/KY/EN)
- ✅ PWA поддержка
- ✅ Админ-панель

## 📄 Документация

- [Техническая спецификация](./FORUM_KG_Technical_Specification.md)
- [Дизайн базы данных](./database_design/forum-kg-database/README.md)

## 🔐 Безопасность

- HTTPS обязателен для продакшена
- JWT аутентификация
- Rate limiting на OTP
- Webhook signature verification
- Защита от переполнения capacity
- Atomic QR check-in операции

## 📧 Контакты

Для вопросов и поддержки: contact@forum.kg

## 📜 Лицензия

Proprietary - All rights reserved
