# FORUM.KG Database Schema

Эта директория содержит схему базы данных Prisma и миграции для платформы FORUM.KG.

## 📁 Структура

```
prisma/
├── schema.prisma          # Основная схема базы данных
├── seed.ts               # Скрипт для заполнения тестовыми данными
├── .env.example          # Пример переменных окружения
├── migrations/           # История миграций (создается автоматически)
└── docs/
    ├── setup.md          # Руководство по настройке
    └── invariants.sql    # Дополнительные constraints
```

## 🚀 Быстрый старт

1. **Создайте базу данных в Neon**
   - Зарегистрируйтесь на https://console.neon.tech/
   - Создайте новый проект `forum-kg`
   - Скопируйте connection strings

2. **Настройте .env**
   ```bash
   cp .env.example .env
   # Добавьте ваши Neon connection strings
   ```

3. **Установите зависимости**
   ```bash
   pnpm install
   ```

4. **Примените миграции**
   ```bash
   pnpm db:migrate
   ```

5. **Заполните тестовыми данными**
   ```bash
   pnpm db:seed
   ```

## 📊 Схема базы данных

### Основные сущности

- **User** - Пользователи системы
- **Forum** - Форумы и мероприятия
- **TicketCategory** - Категории билетов (Standard, VIP)
- **Order** - Заказы пользователей
- **OrderItem** - Позиции заказа (участники)
- **Payment** - Платежи через Finik
- **Ticket** - Выпущенные билеты с QR
- **CheckIn** - Регистрация входа на мероприятие

### Поддержка функций

- **Translations** - Мультиязычность (RU/KY/EN)
- **Notifications** - Система уведомлений
- **TelegramConnection** - Интеграция с Telegram
- **CancellationRequest** - Запросы на отмену
- **AuditLog** - Журнал действий администраторов

## 📖 Документация

Подробные инструкции см. в [docs/setup.md](./docs/setup.md)

## 🔧 Команды

Все команды запускаются из корня проекта:

```bash
# Генерация Prisma Client
pnpm db:generate

# Создание новой миграции
pnpm db:migrate

# Применение миграций (production)
pnpm db:migrate:deploy

# Заполнение БД
pnpm db:seed

# Prisma Studio (GUI)
pnpm db:studio

# Сброс БД (⚠️ удаляет данные)
pnpm db:reset
```

## 🗄️ Neon PostgreSQL

Проект использует **Neon Serverless PostgreSQL**:

- ✅ Автоматическое масштабирование
- ✅ Scale to zero при неактивности
- ✅ Встроенный connection pooling
- ✅ Бранчинг для разработки

## ⚠️ Важные замечания

1. **Никогда не коммитьте `.env` файлы**
2. **Используйте `migrate deploy` в production**, не `migrate dev`
3. **Pooled connection** для runtime, **Direct connection** для миграций
4. **Monetary values** хранятся в минорных единицах (tyiyn): 1 KGS = 100 tyiyn
5. **Timestamps** хранятся в UTC, отображаются в Asia/Bishkek

## 🔐 Безопасность

- Все номера телефонов нормализованы в E.164 формат
- Email адреса в lowercase
- QR токены хранятся в зашифрованном виде
- Пароли OTP хешируются перед сохранением
- Уникальные constraints на критических полях

## 📝 Создание миграции

При изменении схемы:

```bash
# 1. Измените schema.prisma
# 2. Создайте миграцию
pnpm db:migrate

# Prisma спросит название миграции, например:
# "add_forum_banners"

# 3. Проверьте сгенерированный SQL
# 4. Закоммитьте изменения
```

## 🎯 Тестовые данные

После выполнения `pnpm db:seed`:

**Admin аккаунт:**
- Телефон: `+996700000000`
- Роль: SUPER_ADMIN

**Тестовый пользователь:**
- Телефон: `+996700000001`
- Роль: USER

**Пример форума:**
- Tech Summit 2026
- 500 мест
- 2 категории билетов (Standard, VIP)

## 🔗 Ссылки

- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
