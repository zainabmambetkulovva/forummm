-- FORUM.KG PostgreSQL domain checks (run in a Prisma SQL migration after initial tables are created).
-- Prisma does not currently express all custom CHECK constraints in schema.prisma.

ALTER TABLE "Forum"
  ADD CONSTRAINT forum_capacity_gt_zero CHECK ("capacity" > 0),
  ADD CONSTRAINT forum_max_per_account_gt_zero CHECK ("maxTicketsPerAccount" > 0),
  ADD CONSTRAINT forum_end_after_start CHECK ("endsAt" IS NULL OR "endsAt" > "startsAt");

ALTER TABLE "TicketCategory"
  ADD CONSTRAINT ticket_category_price_nonnegative CHECK ("priceMinor" >= 0),
  ADD CONSTRAINT ticket_category_capacity_positive CHECK ("capacity" IS NULL OR "capacity" > 0);

ALTER TABLE "Order"
  ADD CONSTRAINT order_total_nonnegative CHECK ("totalMinor" >= 0 AND "subtotalMinor" >= 0);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT order_item_price_nonnegative CHECK ("unitPriceMinor" >= 0);

ALTER TABLE "Payment"
  ADD CONSTRAINT payment_amount_nonnegative CHECK ("amountMinor" >= 0);

ALTER TABLE "Refund"
  ADD CONSTRAINT refund_amount_positive CHECK ("amountMinor" > 0);

ALTER TABLE "OtpChallenge"
  ADD CONSTRAINT otp_attempts_nonnegative CHECK ("attempts" >= 0);

-- Not expressible as a simple CHECK:
-- * sold + held tickets <= forum/category capacity
-- * per-account ticket limits
-- * order/forum and ticket/forum/category consistency
-- * one valid payment issues one set of tickets
-- Implement under database transactions and row locks in NestJS.
