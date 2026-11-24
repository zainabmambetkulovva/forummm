# 🚀 FORUM.KG - Быстрый старт

Это руководство поможет вам запустить проект локально за 10-15 минут.

## 📋 Требования

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Git**
- Аккаунт **Neon** (бесплатный) для PostgreSQL

---

## 1️⃣ Клонирование и установка

```bash
# Перейти в директорию проекта
cd c:\Users\Dell\OneDrive\Desktop\forum

# Установить зависимости
pnpm install
```

---

## 2️⃣ Настройка базы данных (Neon)

### Шаг 1: Создайте проект в Neon

1. Перейдите на https://console.neon.tech/
2. Создайте аккаунт (если нет)
3. Нажмите **"New Project"**
4. Название: `forum-kg`
5. Регион: **Frankfurt** (ближе к Кыргызстану)
6. PostgreSQL версия: **15** или **16**

### Шаг 2: Получите connection strings

После создания проекта скопируйте:
- **Pooled connection** (для runtime)
- **Direct connection** (для миграций)

### Шаг 3: Настройте .env

```bash
# Создайте .env файл
cp prisma/.env.example prisma/.env
```

Откройте `prisma/.env` и вставьте ваши connection strings:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/forum_kg?sslmode=require&connection_limit=10&pool_timeout=0"
DIRECT_URL="postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/forum_kg?sslmode=require"
```

### Шаг 4: Примените миграции

```bash
# Генерация Prisma Client
pnpm db:generate

# Создание таблиц в БД
pnpm db:migrate

# Заполнение тестовыми данными
pnpm db:seed
```

✅ **Результат:** База данных настроена с тестовыми данными!

---

## 3️⃣ Настройка Backend API

### Создайте .env для API

```bash
cp apps/api/.env.example apps/api/.env
```

Откройте `apps/api/.env` и настройте:

```env
# База данных (те же что в prisma/.env)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# API настройки
API_PORT=3001
NODE_ENV=development

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Временно оставьте пустыми (настроим позже)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMS_PROVIDER=
FINIK_API_KEY=
TELEGRAM_BOT_TOKEN=
```

---

## 4️⃣ Настройка Frontend

### Создайте .env для Web

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Откройте `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 5️⃣ Запуск проекта

### Вариант 1: Запустить все вместе

```bash
pnpm dev
```

### Вариант 2: Запустить раздельно

**Terminal 1 - Backend:**
```bash
pnpm dev:api
```

**Terminal 2 - Frontend:**
```bash
pnpm dev:web
```

---

## 6️⃣ Проверка работы

### Backend API

Откройте: http://localhost:3001/api/docs

Вы должны увидеть **Swagger документацию** с endpoints:
- `/api/forums` - список форумов
- `/api/auth/phone/send-otp` - отправка OTP
- `/api/users/me` - профиль пользователя

### Frontend

Откройте: http://localhost:3000

Вы должны увидеть:
- 🏠 Главную страницу с hero секцией
- 🌐 Переключатель языков (RU/KY/EN)
- 📋 Секцию "Предстоящие форумы"

### База данных

Откройте Prisma Studio для просмотра данных:

```bash
pnpm db:studio
```

Откроется: http://localhost:5555

Проверьте таблицы:
- **User** - 2 пользователя (admin, test user)
- **Forum** - 1 форум (Tech Summit 2026)
- **TicketCategory** - 2 категории (Standard, VIP)
- **SiteSettings** - настройки сайта

---

## 7️⃣ Тестовые данные

После выполнения `pnpm db:seed` доступны:

### Admin аккаунт
- **Телефон:** `+996700000000`
- **Роль:** SUPER_ADMIN
- **Имя:** Администратор Системы

### Тестовый пользователь
- **Телефон:** `+996700000001`
- **Роль:** USER
- **Имя:** Тестовый Пользователь

### Тестовый форум
- **Название:** Tech Summit 2026
- **Дата:** 15 декабря 2026
- **Место:** Гостиница Хаятт, Бишкек
- **Вместимость:** 500 мест
- **Категории:**
  - Standard: 1,500 KGS (400 мест)
  - VIP: 3,500 KGS (100 мест)

---

## 🔧 Полезные команды

```bash
# База данных
pnpm db:studio          # Открыть GUI для БД
pnpm db:generate        # Регенерировать Prisma Client
pnpm db:seed            # Заполнить тестовыми данными
pnpm db:reset           # Сбросить БД (⚠️ удалит все данные)

# Разработка
pnpm dev                # Запустить все
pnpm dev:web            # Только фронтенд
pnpm dev:api            # Только API

# Линтинг
pnpm lint               # Проверить код
pnpm format             # Отформатировать код
```

---

## 🐛 Решение проблем

### "Cannot find module '@prisma/client'"

```bash
pnpm db:generate
```

### "Port 3000 already in use"

Измените порт в `apps/web/package.json`:
```json
"dev": "next dev -p 3002"
```

### "Port 3001 already in use"

Измените `API_PORT` в `apps/api/.env`:
```env
API_PORT=3002
```

### "Database connection failed"

1. Проверьте connection string в `prisma/.env`
2. Убедитесь, что БД создана в Neon
3. Проверьте firewall/VPN

### "pnpm: command not found"

Установите pnpm:
```bash
npm install -g pnpm
```

---

## 📂 Структура URL

| URL | Описание |
|-----|----------|
| http://localhost:3000 | Frontend (Next.js) |
| http://localhost:3000/ru | Русская версия |
| http://localhost:3000/ky | Кыргызская версия |
| http://localhost:3000/en | Английская версия |
| http://localhost:3001 | Backend API |
| http://localhost:3001/api/docs | Swagger документация |
| http://localhost:5555 | Prisma Studio |

---

## 📱 Следующие шаги

Теперь проект запущен локально! Что делать дальше:

### 1. Изучите код
- `apps/web/src/app/[locale]/` - страницы фронтенда
- `apps/api/src/modules/` - модули бэкенда
- `packages/shared-types/` - общие типы
- `prisma/schema.prisma` - схема БД

### 2. Попробуйте API
Откройте Swagger: http://localhost:3001/api/docs

Попробуйте endpoints:
- `GET /api/forums` - получить список форумов
- `GET /api/forums/{id}` - детали форума

### 3. Настройте интеграции (опционально)

Для полной функциональности нужно настроить:
- **Google OAuth** (для входа через Google)
- **SMS Provider** (для OTP верификации)
- **Finik** (для приема платежей)
- **Telegram Bot** (для отправки билетов)

См. `DEVELOPMENT_STATUS.md` для деталей.

---

## 📞 Нужна помощь?

- 📖 Общая документация: `README.md`
- 🗄️ База данных: `prisma/README.md`
- 📦 Типы: `packages/shared-types/README.md`
- 📊 Статус разработки: `DEVELOPMENT_STATUS.md`

---

**Готово! 🎉**

Проект запущен и готов к разработке!
