// User & Auth Enums
export enum Locale {
  RU = 'RU',
  KY = 'KY',
  EN = 'EN',
}

export enum UserRole {
  USER = 'USER',
  SCANNER = 'SCANNER',
  MANAGER = 'MANAGER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
}

export enum OtpPurpose {
  LOGIN = 'LOGIN',
  VERIFY_PHONE = 'VERIFY_PHONE',
  CHANGE_PHONE = 'CHANGE_PHONE',
}

// Forum Enums
export enum ForumStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Order & Payment Enums
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PARTIALLY_CANCELLED = 'PARTIALLY_CANCELLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum PaymentProvider {
  FINIK = 'FINIK',
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUND_PENDING = 'REFUND_PENDING',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  REFUNDED = 'REFUNDED',
}

// Ticket Enums
export enum TicketStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

export enum CheckInMethod {
  QR_ONLINE = 'QR_ONLINE',
  MANUAL_RECONCILED = 'MANUAL_RECONCILED',
}

// Cancellation Enums
export enum CancellationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum RefundMethod {
  FINIK = 'FINIK',
  MANUAL = 'MANUAL',
}

export enum RefundStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// Notification Enums
export enum NotificationType {
  FORUM_PUBLISHED = 'FORUM_PUBLISHED',
  FORUM_UPDATED = 'FORUM_UPDATED',
  FORUM_CANCELLED = 'FORUM_CANCELLED',
  EVENT_REMINDER = 'EVENT_REMINDER',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  TICKETS_ISSUED = 'TICKETS_ISSUED',
  CANCELLATION_UPDATED = 'CANCELLATION_UPDATED',
}

export enum NotificationChannel {
  TELEGRAM = 'TELEGRAM',
  WEB_PUSH = 'WEB_PUSH',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  RETRYING = 'RETRYING',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

// Integration Enums
export enum IntegrationProvider {
  GOOGLE = 'GOOGLE',
  SMS = 'SMS',
  FINIK = 'FINIK',
  TELEGRAM = 'TELEGRAM',
  WEB_PUSH = 'WEB_PUSH',
  AI = 'AI',
}

export enum IntegrationState {
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  ERROR = 'ERROR',
}

export enum WebhookEventStatus {
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  IGNORED = 'IGNORED',
  FAILED = 'FAILED',
}

export enum OfflineAdmissionStatus {
  PROVISIONAL = 'PROVISIONAL',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  DUPLICATE = 'DUPLICATE',
}
