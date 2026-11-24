-- Additional database constraints for FORUM.KG
-- Apply these constraints AFTER running initial Prisma migration
-- These constraints enforce business rules at the database level

-- ========================================
-- CAPACITY CONSTRAINTS
-- ========================================

-- Forum capacity must be positive
ALTER TABLE "Forum" 
ADD CONSTRAINT "Forum_capacity_positive" 
CHECK (capacity > 0);

-- Max tickets per account must be positive
ALTER TABLE "Forum" 
ADD CONSTRAINT "Forum_maxTicketsPerAccount_positive" 
CHECK ("maxTicketsPerAccount" > 0);

-- Ticket category capacity must be positive if set
ALTER TABLE "TicketCategory" 
ADD CONSTRAINT "TicketCategory_capacity_positive" 
CHECK (capacity IS NULL OR capacity > 0);

-- Ticket category price must be non-negative
ALTER TABLE "TicketCategory" 
ADD CONSTRAINT "TicketCategory_price_non_negative" 
CHECK ("priceMinor" >= 0);

-- ========================================
-- MONETARY CONSTRAINTS
-- ========================================

-- Order amounts must be positive
ALTER TABLE "Order" 
ADD CONSTRAINT "Order_amounts_positive" 
CHECK ("subtotalMinor" > 0 AND "totalMinor" > 0);

-- Order item unit price must be positive
ALTER TABLE "OrderItem" 
ADD CONSTRAINT "OrderItem_price_positive" 
CHECK ("unitPriceMinor" > 0);

-- Payment amount must be positive
ALTER TABLE "Payment" 
ADD CONSTRAINT "Payment_amount_positive" 
CHECK ("amountMinor" > 0);

-- Refund amount must be positive
ALTER TABLE "Refund" 
ADD CONSTRAINT "Refund_amount_positive" 
CHECK ("amountMinor" > 0);

-- ========================================
-- TIME CONSTRAINTS
-- ========================================

-- Forum must start before it ends (if end time is set)
ALTER TABLE "Forum" 
ADD CONSTRAINT "Forum_start_before_end" 
CHECK ("endsAt" IS NULL OR "startsAt" < "endsAt");

-- QR expiration must be after forum start
ALTER TABLE "Forum" 
ADD CONSTRAINT "Forum_qr_after_start" 
CHECK ("qrExpiresAt" >= "startsAt");

-- Order reservation must be in the future when set
-- (Note: This is checked at creation time, not enforced continuously)

-- ========================================
-- PHONE NUMBER FORMAT
-- ========================================

-- Phone numbers must start with + and contain only digits
ALTER TABLE "User" 
ADD CONSTRAINT "User_phone_format" 
CHECK (phone IS NULL OR phone ~ '^\+[0-9]{10,15}$');

ALTER TABLE "OtpChallenge" 
ADD CONSTRAINT "OtpChallenge_phone_format" 
CHECK (phone ~ '^\+[0-9]{10,15}$');

-- ========================================
-- EMAIL FORMAT
-- ========================================

-- Email must contain @ symbol (basic validation)
ALTER TABLE "User" 
ADD CONSTRAINT "User_email_format" 
CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$');

-- ========================================
-- STATUS TRANSITIONS
-- ========================================

-- Ticket cannot be used before it's issued
ALTER TABLE "Ticket" 
ADD CONSTRAINT "Ticket_used_after_issued" 
CHECK ("usedAt" IS NULL OR "usedAt" >= "issuedAt");

-- Ticket cannot be cancelled before it's issued
ALTER TABLE "Ticket" 
ADD CONSTRAINT "Ticket_cancelled_after_issued" 
CHECK ("cancelledAt" IS NULL OR "cancelledAt" >= "issuedAt");

-- Order cannot be paid before creation
ALTER TABLE "Order" 
ADD CONSTRAINT "Order_paid_after_created" 
CHECK ("paidAt" IS NULL OR "paidAt" >= "createdAt");

-- ========================================
-- PARTICIPANT NAME CONSTRAINTS
-- ========================================

-- Participant names must not be empty
ALTER TABLE "OrderItem" 
ADD CONSTRAINT "OrderItem_participant_names_not_empty" 
CHECK (
  LENGTH(TRIM("participantFirstName")) > 0 AND 
  LENGTH(TRIM("participantLastName")) > 0
);

-- ========================================
-- CURRENCY CONSTRAINTS
-- ========================================

-- Currency must be 3 uppercase letters (ISO 4217)
ALTER TABLE "TicketCategory" 
ADD CONSTRAINT "TicketCategory_currency_format" 
CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE "Order" 
ADD CONSTRAINT "Order_currency_format" 
CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE "Payment" 
ADD CONSTRAINT "Payment_currency_format" 
CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE "Refund" 
ADD CONSTRAINT "Refund_currency_format" 
CHECK (currency ~ '^[A-Z]{3}$');

-- ========================================
-- URL CONSTRAINTS
-- ========================================

-- URLs must start with http:// or https://
ALTER TABLE "SocialLink" 
ADD CONSTRAINT "SocialLink_url_format" 
CHECK (url ~ '^https?://');

-- ========================================
-- HEX COLOR CONSTRAINTS
-- ========================================

-- Hex colors must be valid format: #RRGGBB
ALTER TABLE "SiteSettings" 
ADD CONSTRAINT "SiteSettings_colors_format" 
CHECK (
  "primaryColorHex" ~ '^#[0-9A-Fa-f]{6}$' AND
  "accentColorHex" ~ '^#[0-9A-Fa-f]{6}$'
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Additional indexes for common queries

-- User lookups by phone/email
CREATE INDEX IF NOT EXISTS "idx_user_phone_verified" 
ON "User" (phone, "phoneVerifiedAt") 
WHERE phone IS NOT NULL;

-- Forum availability queries
CREATE INDEX IF NOT EXISTS "idx_forum_published" 
ON "Forum" (status, "publishedAt", "startsAt") 
WHERE status IN ('PUBLISHED', 'SCHEDULED');

-- Ticket lookups by QR token hash
CREATE INDEX IF NOT EXISTS "idx_ticket_qr_active" 
ON "Ticket" ("qrTokenHash", status) 
WHERE status = 'ACTIVE';

-- Order lookups by status and date
CREATE INDEX IF NOT EXISTS "idx_order_status_date" 
ON "Order" (status, "createdAt" DESC);

-- Payment webhook deduplication
CREATE INDEX IF NOT EXISTS "idx_payment_webhook_dedupe" 
ON "PaymentWebhookEvent" (provider, "dedupeKey", "receivedAt");

-- Check-in lookups
CREATE INDEX IF NOT EXISTS "idx_checkin_forum_date" 
ON "CheckIn" ("forumId", "checkedInAt" DESC);

-- Notification unread count
CREATE INDEX IF NOT EXISTS "idx_notification_unread" 
ON "Notification" ("userId", "readAt") 
WHERE "readAt" IS NULL;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON CONSTRAINT "Forum_capacity_positive" ON "Forum" IS 
'Total forum capacity must be greater than 0';

COMMENT ON CONSTRAINT "Forum_start_before_end" ON "Forum" IS 
'Forum end time must be after start time';

COMMENT ON CONSTRAINT "Order_amounts_positive" ON "Order" IS 
'Order subtotal and total must be positive amounts';

COMMENT ON CONSTRAINT "Ticket_used_after_issued" ON "Ticket" IS 
'Ticket cannot be marked as used before it is issued';

-- End of invariants.sql
