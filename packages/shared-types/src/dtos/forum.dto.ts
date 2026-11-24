import { z } from 'zod';

// Forum translation DTO
export const forumTranslationSchema = z.object({
  locale: z.enum(['RU', 'KY', 'EN']),
  title: z.string().min(1, 'Title is required').max(255),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  program: z.string().optional(),
});

export type ForumTranslationDto = z.infer<typeof forumTranslationSchema>;

// Ticket category translation DTO
export const categoryTranslationSchema = z.object({
  locale: z.enum(['RU', 'KY', 'EN']),
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(500).optional(),
});

export type CategoryTranslationDto = z.infer<typeof categoryTranslationSchema>;

// Ticket category DTO
export const ticketCategorySchema = z.object({
  code: z.string().min(1).max(40),
  priceMinor: z.number().int().min(0, 'Price must be non-negative'),
  currency: z.string().length(3).toUpperCase().default('KGS'),
  capacity: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  translations: z.array(categoryTranslationSchema).min(1, 'At least one translation is required'),
});

export type TicketCategoryDto = z.infer<typeof ticketCategorySchema>;

// Create Forum DTO
export const createForumSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED']).default('DRAFT'),
  bannerUrl: z.string().url().optional(),
  venueName: z.string().max(255).optional(),
  venueAddress: z.string().optional(),
  timeZone: z.string().default('Asia/Bishkek'),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  qrExpiresAt: z.coerce.date(),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
  maxTicketsPerAccount: z.number().int().positive().default(1),
  publishAt: z.coerce.date().optional(),
  translations: z.array(forumTranslationSchema).min(1, 'At least one translation is required'),
  categories: z.array(ticketCategorySchema).min(1, 'At least one ticket category is required'),
});

export type CreateForumDto = z.infer<typeof createForumSchema>;

// Update Forum DTO
export const updateForumSchema = createForumSchema.partial();

export type UpdateForumDto = z.infer<typeof updateForumSchema>;

// Forum query params
export const forumQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'COMPLETED', 'CANCELLED']).optional(),
  locale: z.enum(['RU', 'KY', 'EN']).default('RU'),
});

export type ForumQueryDto = z.infer<typeof forumQuerySchema>;
