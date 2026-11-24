# @forum-kg/shared-types

Общие TypeScript типы, интерфейсы, enums и валидационные схемы для frontend и backend платформы FORUM.KG.

## 📦 Структура

```
shared-types/
├── src/
│   ├── entities/          # Типы сущностей
│   │   ├── user.types.ts
│   │   ├── forum.types.ts
│   │   ├── order.types.ts
│   │   └── ticket.types.ts
│   ├── dtos/             # Data Transfer Objects с Zod валидацией
│   │   ├── auth.dto.ts
│   │   ├── forum.dto.ts
│   │   └── order.dto.ts
│   ├── enums/            # Перечисления
│   │   └── index.ts
│   ├── validators/       # Вспомогательные функции валидации
│   │   └── index.ts
│   └── index.ts          # Главный экспорт
```

## 🚀 Использование

### В Backend (NestJS)

```typescript
import {
  CreateForumDto,
  createForumSchema,
  ForumStatus,
  UserRole,
} from 'shared-types';

// Валидация с Zod
const result = createForumSchema.safeParse(data);
if (!result.success) {
  throw new BadRequestException(result.error);
}

// Использование enums
if (user.role === UserRole.SUPER_ADMIN) {
  // ...
}
```

### В Frontend (Next.js)

```typescript
import {
  Forum,
  ForumListItem,
  createOrderSchema,
  OrderStatus,
  formatPrice,
} from 'shared-types';

// Типизация компонентов
interface ForumCardProps {
  forum: ForumListItem;
}

// Валидация форм с React Hook Form
const form = useForm<CreateOrderDto>({
  resolver: zodResolver(createOrderSchema),
});

// Форматирование
const price = formatPrice(1500000, 'KGS'); // "1 500 KGS"
```

## 📚 Основные экспорты

### Entities (Типы сущностей)

```typescript
import {
  User,
  UserProfile,
  Forum,
  ForumListItem,
  Order,
  OrderItem,
  Ticket,
  TicketDetails,
} from 'shared-types';
```

### DTOs (с Zod валидацией)

```typescript
import {
  // Auth
  SendOtpDto,
  sendOtpSchema,
  VerifyOtpDto,
  verifyOtpSchema,
  CompleteProfileDto,
  completeProfileSchema,

  // Forums
  CreateForumDto,
  createForumSchema,
  UpdateForumDto,
  updateForumSchema,

  // Orders
  CreateOrderDto,
  createOrderSchema,
  OrderItemDto,
  orderItemSchema,
} from 'shared-types';
```

### Enums

```typescript
import {
  Locale,              // RU | KY | EN
  UserRole,            // USER | SCANNER | MANAGER | SUPER_ADMIN
  UserStatus,          // ACTIVE | SUSPENDED
  ForumStatus,         // DRAFT | SCHEDULED | PUBLISHED | COMPLETED | CANCELLED
  OrderStatus,         // PENDING_PAYMENT | PAID | CANCELLED | ...
  PaymentStatus,       // CREATED | PENDING | SUCCEEDED | FAILED | ...
  TicketStatus,        // ACTIVE | USED | CANCELLED
  NotificationType,    // FORUM_PUBLISHED | TICKETS_ISSUED | ...
} from 'shared-types';
```

### Validators & Helpers

```typescript
import {
  validatePhone,       // Валидация номера телефона
  validateEmail,       // Валидация email
  normalizePhone,      // Нормализация телефона в E.164
  normalizeEmail,      // Lowercase + trim
  formatPrice,         // Форматирование цены
  formatDate,          // Форматирование даты
  formatDateTime,      // Форматирование даты и времени
} from 'shared-types';
```

### Constants

```typescript
import {
  SUPPORTED_LOCALES,              // ['ru', 'ky', 'en']
  DEFAULT_LOCALE,                 // 'ru'
  DEFAULT_TIMEZONE,               // 'Asia/Bishkek'
  DEFAULT_CURRENCY,               // 'KGS'
  BUSINESS_RULES,                 // Бизнес-правила
  ErrorCode,                      // Коды ошибок
} from 'shared-types';
```

## 🔧 Примеры использования

### Валидация формы регистрации

```typescript
import { sendOtpSchema } from 'shared-types';

const handleSendOtp = (data: unknown) => {
  const result = sendOtpSchema.safeParse(data);

  if (!result.success) {
    console.error(result.error.flatten());
    return;
  }

  // result.data теперь типизирован как SendOtpDto
  api.sendOtp(result.data);
};
```

### Создание заказа

```typescript
import { createOrderSchema, CreateOrderDto } from 'shared-types';

const form = useForm<CreateOrderDto>({
  resolver: zodResolver(createOrderSchema),
  defaultValues: {
    forumId: '',
    items: [],
  },
});

const onSubmit = async (data: CreateOrderDto) => {
  const order = await createOrder(data);
  router.push(`/orders/${order.id}`);
};
```

### Работа с типами

```typescript
import { Forum, ForumStatus } from 'shared-types';

function isPublishedForum(forum: Forum): boolean {
  return forum.status === ForumStatus.PUBLISHED;
}

function getForumTitle(forum: Forum, locale: 'ru' | 'ky' | 'en'): string {
  const translation = forum.translations.find(t => t.locale === locale.toUpperCase());
  return translation?.title || forum.translations[0]?.title || 'Без названия';
}
```

### Форматирование данных

```typescript
import { formatPrice, formatDateTime } from 'shared-types';

// Цена
const price = formatPrice(150000, 'KGS'); // "1 500 KGS"

// Дата
const date = formatDateTime(new Date('2026-12-15T09:00:00Z'), 'ru');
// "15 декабря 2026 г., 09:00"
```

## 🎯 Business Rules

Пакет экспортирует константы бизнес-правил:

```typescript
import { BUSINESS_RULES } from 'shared-types';

console.log(BUSINESS_RULES.DEFAULT_MAX_TICKETS_PER_ACCOUNT); // 1
console.log(BUSINESS_RULES.DEFAULT_RESERVATION_TIMEOUT_MINUTES); // 10
console.log(BUSINESS_RULES.OTP_CODE_LENGTH); // 6
console.log(BUSINESS_RULES.OTP_EXPIRY_MINUTES); // 5
console.log(BUSINESS_RULES.MAX_TICKETS_PER_ORDER); // 10
```

## 📐 Типы API Response

```typescript
import { ApiResponse, ApiError, PaginatedResponse } from 'shared-types';

// Стандартный ответ
interface ForumResponse extends ApiResponse<Forum> {}

// Пагинированный ответ
interface ForumsResponse extends PaginatedResponse<ForumListItem> {}

// Обработка ошибок
catch (error: ApiError) {
  console.error(error.message);
}
```

## 🔒 Коды ошибок

```typescript
import { ErrorCode } from 'shared-types';

// Аутентификация
ErrorCode.INVALID_CREDENTIALS
ErrorCode.PHONE_NOT_VERIFIED
ErrorCode.OTP_EXPIRED

// Билеты
ErrorCode.TICKET_LIMIT_EXCEEDED
ErrorCode.FORUM_SOLD_OUT
ErrorCode.TICKET_ALREADY_USED

// И другие...
```

## 📝 Добавление новых типов

1. Создайте файл в соответствующей директории
2. Экспортируйте типы через `index.ts`
3. Пересоберите пакет: `pnpm build`

## 🧪 Тестирование схем

```typescript
import { createForumSchema } from 'shared-types';

describe('createForumSchema', () => {
  it('validates valid forum data', () => {
    const data = {
      slug: 'tech-summit-2026',
      capacity: 500,
      // ...
    };

    const result = createForumSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('rejects invalid slug', () => {
    const data = {
      slug: 'Invalid Slug!',
      // ...
    };

    const result = createForumSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
```

## 🔄 Синхронизация с Prisma

Типы сущностей должны соответствовать Prisma схеме. При изменении `schema.prisma`:

1. Обновите соответствующие типы в `shared-types`
2. Обновите DTO схемы при необходимости
3. Обновите enums

## 📄 Лицензия

Proprietary - All rights reserved
