import { z } from 'zod';

// Participant info schema
export const participantSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

export type ParticipantDto = z.infer<typeof participantSchema>;

// Order item schema
export const orderItemSchema = z.object({
  ticketCategoryId: z.string().uuid('Invalid category ID'),
  participantFirstName: z.string().min(1, 'Participant first name is required').max(100),
  participantLastName: z.string().min(1, 'Participant last name is required').max(100),
});

export type OrderItemDto = z.infer<typeof orderItemSchema>;

// Create Order DTO
export const createOrderSchema = z.object({
  forumId: z.string().uuid('Invalid forum ID'),
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one ticket is required')
    .max(10, 'Maximum 10 tickets per order'),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

// Order query params
export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z
    .enum([
      'PENDING_PAYMENT',
      'PAID',
      'PARTIALLY_CANCELLED',
      'CANCELLED',
      'EXPIRED',
      'PAYMENT_FAILED',
    ])
    .optional(),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;

// Cancellation request DTO
export const createCancellationRequestSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  ticketId: z.string().uuid('Invalid ticket ID').optional(),
  reason: z.string().max(1000).optional(),
});

export type CreateCancellationRequestDto = z.infer<typeof createCancellationRequestSchema>;

// Review cancellation DTO (Admin)
export const reviewCancellationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNote: z.string().max(1000).optional(),
});

export type ReviewCancellationDto = z.infer<typeof reviewCancellationSchema>;
