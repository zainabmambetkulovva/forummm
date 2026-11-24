# FORUM.KG — Database Transactions and Operational Rules

## 1. Ticket reservation transaction

Treat available inventory and per-account ticket allowance as **shared resources**. Do not use `findMany → count → insert` without locks.

A safe transaction outline:

1. Verify signed-in user, verified phone, completed first/last name and published forum.
2. Begin a database transaction.
3. Lock the relevant forum row (`SELECT id FROM "Forum" WHERE id = $1 FOR UPDATE`) to serialize checkout reservations for this forum.
4. Validate categories belong to the forum, are active and have valid prices.
5. Count valid issued tickets, including `USED` but excluding `CANCELLED`, **and** active held order items whose orders are `PENDING_PAYMENT` and `reservedUntil > now()`.
6. Recheck overall forum capacity, per-category capacity, and the account's remaining allowance using the requested quantities.
7. Create `Order` and participant-specific `OrderItem`s with a `reservedUntil` timestamp.
8. Commit; create the Finik payment attempt (provider call occurs outside the DB transaction).
9. Handle payment initialization failure by transitioning the order to a non-reserved terminal status.

Use a fixed lock order across code paths to avoid deadlocks. Be careful not to double-count order items whose corresponding tickets have already been issued. Use bounded transactions and retry serialization/deadlock failures selectively.

## 2. Finik payment confirmation

The payment handler must verify the provider signature, order reference, currency, amount and payment status. Assign a durable `PaymentWebhookEvent.dedupeKey` (provider event ID, or a stable derived identifier).

Within a database transaction:

1. Insert/claim the webhook event's deduplication key; if already successfully processed, return safely.
2. Lock the order row and check current financial state.
3. Verify the payment attempt and update its status to `SUCCEEDED` if appropriate.
4. Mark the order as paid only once, with `paidAt`.
5. For each order item, create a `Ticket` only if one does not already exist (`Ticket.orderItemId` enforces this).
6. Store a secure hash and an application-encrypted copy of the unique QR token; never store plaintext tokens.
7. Persist a durable notification/outbox item for subsequent Telegram and push delivery.
8. Commit, acknowledge the webhook, and let a worker handle outbound delivery.

**Late payments:** If a checkout hold expired, never oversell automatically. Reconcile under locked inventory and payment state. If inventory cannot be issued, flag for staff resolution/refund according to the agreed policy.

**Important:** Do not keep the DB transaction open while calling Finik, Telegram or SMS APIs.

## 3. Single-use QR transaction

When scanning a QR code:

1. Hash the supplied high-entropy token and locate `Ticket` by `qrTokenHash`.
2. Check that the selected forum matches, the associated order is paid, and the ticket's payment was verified.
3. Check `expiresAt > current server time` and that the forum is not cancelled.
4. Atomically update ticket only if `status = ACTIVE`, `expiresAt > now()` and relevant payment conditions hold.
5. Insert a `CheckIn` in the **same transaction**.
6. Return `PAID / VALID` for a successful redemption and `ALREADY USED`, `EXPIRED`, `CANCELLED`, etc., for failures.

`CheckIn.ticketId` has a database unique constraint; two scanners cannot both record a successful check-in. The client-facing QR validation page must not consume a ticket unless an authorized scanner performs the actual check-in action.

## 4. QR expiration and revoked tickets

There is no `EXPIRED` stored ticket status, because expiration is derived from the clock. Display state:

- `now() >= expiresAt` → QR expired (black screen; expiration takes precedence).
- Otherwise `CANCELLED` → Ticket cancelled.
- Otherwise `USED` → Ticket already used.
- Otherwise `ACTIVE` → Eligible for verification, subject to payment/forum checks.

The schema stores `Ticket.expiresAt` at issuance. If the admin later changes `Forum.qrExpiresAt`, define whether existing issued tickets keep their original expiry or are updated after a deliberate admin action. Record such changes in `AuditLog`.

## 5. Cancellation / replacement

Cancellation requests are separate from payment refunds. Ticket cancellation should be performed transactionally under the same forum lock as purchase inventory changes. Keep `USED` tickets counting toward per-account caps unless an explicit approved policy provides otherwise. Do not automatically issue a refund because the request was submitted.

For multi-ticket orders, `CancellationRequest.ticketId` may be null for whole-order cancellation or specify a particular ticket. The exact allowed behavior remains undecided.

## 6. Offline receipt-based admissions

When the internet is unavailable, staff may record receipt-based entry as `OfflineAdmission(PROVISIONAL)` with minimal required details. This is not equivalent to a successful verified `CheckIn`. After connectivity returns, staff reconcile records against valid paid tickets and flag duplicates, mismatches and missing payments. Use an authenticated operator and audit reconciliation decisions.

## 7. Indexes, data protection, data retention

- `User.phone` and `User.email` are unique when present; normalize before saving.
- QR tokens must be sufficiently random (e.g., 256-bit random), hashed for lookups, and encrypted for re-delivery with a key kept outside the DB.
- Never store Google OAuth secrets, Finik API keys or Telegram bot tokens in `IntegrationHealth`.
- Configure a retention policy for OTPs, old webhook events, push subscriptions, and financial audit records.
- Encrypt sensitive data in transit; restrict staff access to phone numbers and receipt metadata.
- Back up and test Neon branch/migration recovery procedures.

## 8. Recommended NestJS modules

`AuthModule`, `UsersModule`, `ForumsModule`, `InventoryModule`, `OrdersModule`, `PaymentsModule`, `TicketsModule`, `CheckInModule`, `CancellationsModule`, `NotificationsModule`, `TelegramModule`, `AdminModule`, `SettingsModule`, `IntegrationsModule`, `AuditModule`.

This file describes transaction design, not a complete runnable NestJS implementation.
