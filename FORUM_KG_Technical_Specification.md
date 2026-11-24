# FORUM.KG — Technical Specification

**Document type:** Software Requirements Specification (SRS)  
**Version:** 1.0  
**Date:** November 20, 2026  
**Status:** Draft for technical review  
**Project name:** FORUM.KG (editable display name)  
**Primary market:** Kyrgyzstan  
**Typical event size:** 50–1,000 attendees per forum  
**Default language:** Russian (`ru`)  
**Additional languages:** Kyrgyz (`ky`), English (`en`)

---

## 1. Project Overview

FORUM.KG is a web platform for publishing forums, selling admission tickets, delivering unique QR tickets, and managing entry to events. It consists of:

1. A public landing page and forum detail pages.
2. Registration, authentication, and a personal user dashboard.
3. An administration panel for forums, users, payments, orders, and site settings.
4. A staff QR scanning interface for event admission.
5. An installable Progressive Web App (PWA).
6. Integrations with Finik, Telegram, Google authentication, and an SMS verification provider.

**Main workflow:** Admin publishes a forum → user registers → selects tickets and enters participant details → pays through Finik → server verifies payment → individual QR tickets are issued → tickets appear in the user dashboard and are sent to linked Telegram → staff validate QR tickets at the venue.

### 1.1 Objectives

- Sell tickets securely for forums with different capacities and ticket categories.
- Enable administrators to publish and manage forums without developer intervention.
- Automate ticket issuance after verified payments.
- Prevent duplicate successful use of a QR ticket.
- Provide operational statistics and an audit trail.
- Offer a mobile-friendly multilingual experience.

### 1.2 Out of Scope for the Initial Release

Unless subsequently approved, the following are not required for the first release: native iOS/Android applications, microservices, automatic ticket-category upgrades, a full AI assistant, affiliate programs, or a promotional-code engine.

---

## 2. Confirmed Business Rules

| ID | Requirement |
|---|---|
| BR-01 | One account may purchase tickets for multiple different forums. |
| BR-02 | The default limit is **one ticket per account per forum**. |
| BR-03 | An administrator may set a different per-account ticket limit for each forum (e.g., 2 or 3). |
| BR-04 | Each ticket must have its own participant's first and last name, even when one account purchases multiple tickets. |
| BR-05 | Forums may offer multiple categories, initially **Standard** and **VIP**, with separately configured prices and capacities. |
| BR-06 | A purchased ticket cannot be upgraded or changed from Standard to VIP (or vice versa). |
| BR-07 | Tickets are issued **only after** backend verification of successful payment. |
| BR-08 | Each ticket must have a unique QR identifier. |
| BR-09 | A QR ticket is valid for **one successful check-in only**. |
| BR-10 | A valid QR is sufficient for normal admission; identity-document comparison is not mandatory. |
| BR-11 | The admin specifies each forum's QR expiration date and time. |
| BR-12 | Expired QR links must show a **black screen** and a clear expiration message. |
| BR-13 | Users may submit cancellation requests after payment; the request goes to the Admin Panel. |
| BR-14 | After a cancellation is approved and the applicable ticket is invalidated, its slot under the account purchase limit becomes available again. |
| BR-15 | Publishing a new forum creates notifications for all registered users. Delivery through external channels depends on connection and permission status. |
| BR-16 | Google-authenticated users must also provide and verify a phone number. |
| BR-17 | Russian is the default website language; Kyrgyz and English must also be supported. |
| BR-18 | The website display name and branding can be changed through the Admin Panel. |
| BR-19 | Production application data is stored in **Neon Serverless PostgreSQL**. |
| BR-20 | Tickets remain available in the user's dashboard even if Telegram delivery fails. |

> **Important:** The exact financial refund procedure is not yet approved. Cancellation approval, ticket invalidation, and refund settlement must be modeled as separate operations.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React, App Router), TypeScript |
| UI styling | Tailwind CSS, shadcn/ui, Radix UI, Lucide React |
| Internationalization | next-intl |
| Data and forms | TanStack Query, React Hook Form, Zod |
| Backend | NestJS, TypeScript, REST API, Swagger/OpenAPI |
| Primary database | **Neon Serverless PostgreSQL** |
| ORM | Prisma |
| Cache and background jobs | Redis, BullMQ |
| Payments | Finik Web SDK / API; verified server-side callbacks |
| Google login | OAuth / OpenID Connect |
| Phone verification | SMS OTP through a provider to be selected |
| Telegram | Telegram Bot API, Telegraf |
| QR generation / scanning | Node QR-code library; ZXing-compatible browser scanner |
| PWA | Web App Manifest, Service Worker, Web Push |
| Files | S3-compatible object storage |
| Testing | Jest, Playwright; integration and load testing |
| Monitoring | Sentry and structured server logs |
| Deployment | Docker, HTTPS reverse proxy (e.g., Nginx) |
| Repository | pnpm monorepo |

### 3.1 Architecture

Use a **modular monolith**, not microservices, in the first version:

```text
forum-kg/
├── apps/
│   ├── web/           # Next.js: landing, account, admin, scanner, PWA
│   ├── api/           # NestJS: application and integration APIs
│   └── worker/        # BullMQ: notifications, ticket delivery, retries
├── packages/
│   ├── shared-types/
│   ├── api-client/
│   └── config/
├── prisma/
└── docker-compose.yml
```

Suggested routes:

- `/` — landing page.
- `/forums` and `/forums/[slug]` — published forums and details.
- `/account` — user dashboard.
- `/admin` — administration dashboard.
- `/admin/scanner` — authorized QR scanner.
- `api.forum.kg` — API, if deployed on a dedicated subdomain.

The editable **site display name** is distinct from the registered domain name.

---

## 4. User Roles and Authorization

| Role | Access |
|---|---|
| Guest | Browse public pages and forums; register/login. |
| Registered User | Manage profile; purchase and view tickets; view payments; send cancellation requests; configure notifications. |
| Super Admin | Full administration, including staff roles, settings, and integrations. |
| Manager | Manage forums, orders, cancellation requests, and relevant reporting; no unrestricted infrastructure access. |
| Scanner Operator | Select assigned forum; scan and validate tickets; view limited check-in information. |

The backend must enforce permissions independently of what the frontend displays.

---

## 5. Public Landing Page

### 5.1 Content

Keep the landing page minimal. It must include:

- Header with logo, site display name, navigation, language switcher, and login/profile entry.
- Hero section with an image, short slogan, and **View Forums** call to action.
- **Upcoming Forums** section with forum cards.
- Brief information about the organizer.
- Contacts and social media links.
- Footer with relevant informational and legal links.

### 5.2 Forum Cards

Each card displays: image, title, short description, date/time, location, available ticket categories, starting price, availability, and purchase button.

Only published forums are publicly visible. Sold-out forums must show a clear sold-out state.

### 5.3 Forum Details Page

Show: full title, description, images, venue, date/time, optional program, category prices, capacity/availability, and a purchase action. All event content must be managed from the Admin Panel.

---

## 6. Registration and Authentication

### 6.1 Profile Data

| Field | Required |
|---|---|
| First name | Yes |
| Last name | Yes |
| Phone number | Yes, verified |
| Email | No for phone registration; may be supplied by Google |

### 6.2 Login Methods

- **Google login:** Authenticate with Google, then request and verify a phone number if the account has no verified number. Collect any missing mandatory profile fields.
- **Phone login:** Send a one-time SMS code; verify it before creating or accessing the account.

### 6.3 Security

- Enforce one verified phone number per active account.
- Securely link Google and phone credentials to prevent accidental duplicate accounts.
- Apply OTP expiration, resend limits, attempt limits, and rate limits.
- Re-verify ownership before changing a phone number.
- Use secure sessions (e.g., HttpOnly and Secure cookies) and CSRF protection where applicable.

The SMS provider is **to be selected**.

---

## 7. User Dashboard

The authenticated user area must have these sections:

1. **Overview:** upcoming events, active tickets, notifications.
2. **Available Forums:** browse, select categories/quantities, begin purchase.
3. **My Tickets:** each ticket's participant, forum, category, QR, expiration, and status.
4. **Orders:** order number, date, items, total, payment and cancellation status.
5. **Payment History:** date, exact time, amount, provider, transaction reference, status.
6. **Notifications:** new forums, payment and ticket messages, event changes, cancellation updates.
7. **Profile Settings:** first/last name, phone, optional email, preferred language, Telegram connection.

The user's tickets must remain in their account history after use or expiration.

---

## 8. Admin Panel

### 8.1 Navigation

- Dashboard.
- Forums.
- Orders and Cancellation Requests.
- Payments.
- Tickets.
- Users.
- Check-in / QR Scanner.
- Notifications.
- Analytics and Exports.
- Staff and Roles (Super Admin).
- Website Settings.
- Integrations and Health.
- Audit Log.

### 8.2 Dashboard Statistics

Provide forum-specific and overall metrics: registered users, published forums, sold tickets, confirmed payment totals, check-ins, remaining capacity, and pending cancellation requests.

### 8.3 Users

Display registered users with first/last name, verified phone, optional email, registration time, account status, and purchase summary. Provide search and user detail views.

### 8.4 Payments

Show who paid, for which forum, the amount, payment status, **exact date and time**, and transaction reference. Provide a **calendar-date filter only**; selecting an hour/time range is not required.

### 8.5 Website Settings

Editable without code changes: display name, logo, site colors, hero images, short slogan, organizer information, contact details, and social media links.

### 8.6 Integrations

Monitor Google login, SMS provider, Finik, Telegram, Web Push, and optional AI integration. Display real configuration/health state, last check, relevant errors, and a human-readable resolution message. Never expose secrets or API keys.

AI must show **Not Configured** until its purpose and implementation are approved.

### 8.7 Audit Log

Record sensitive changes (forum publication, price/date edits, cancellation approvals, role changes, manual ticket invalidation, site settings) with actor, timestamp, target, and action.

---

## 9. Forum Creation and Management

### 9.1 Forum Fields

| Field | Requirement |
|---|---|
| Title | Localizable |
| Short / full description | Localizable |
| Cover image | Required |
| Date / start time | Required |
| End time | Optional |
| Venue/address | Required |
| Program | Optional and localizable |
| Total capacity | Positive integer |
| Ticket categories | At least one; Standard/VIP supported |
| Category price / capacity | Configurable per category |
| Ticket limit per account | Positive integer, **default 1** |
| QR expiration | Required date and time |
| Publication time | Now or scheduled |
| Status | Draft, scheduled, published, completed, cancelled |

Use the **Asia/Bishkek** time zone for initial event configuration; store timestamps consistently and display event-local times.

### 9.2 Publishing and Editing

- Draft forums are not public.
- Scheduled forums become public at the configured publication time.
- Publishing adds the forum to the landing page and user dashboard and creates notifications for registered users.
- Updating important published information (date, time, venue) sends updates to affected ticket owners.
- Sold-out status is calculated from available inventory; it should not replace the underlying event lifecycle status.

### 9.3 Inventory and Limits

- Total sold/held ticket inventory must never exceed capacity.
- Category inventory must never exceed its configured limit.
- Paid tickets and active checkout reservations count toward the account's allowed quantity.
- Used tickets continue to count as purchased tickets.
- Successfully cancelled tickets no longer consume the account's purchase allowance.
- Changing the limit must not invalidate existing valid purchases.

---

## 10. Ticket Purchase and Orders

### 10.1 Checkout Flow

1. User signs in and verifies their phone number.
2. User selects a published forum, categories, and ticket quantities.
3. Backend validates forum/category availability and account limit.
4. User enters a separate **first and last name for every ticket**.
5. Backend creates an order and temporarily reserves inventory.
6. User completes payment through Finik.
7. Backend verifies successful payment.
8. Backend issues one independent ticket and QR token per participant.
9. Tickets appear in **My Tickets** and Telegram delivery is queued if connected.

### 10.2 Multiple Tickets

For example, when a forum limit is 3, one account can buy three tickets for three named participants. Each ticket may have its own category and QR. All tickets remain associated with the buying account, while each participant's identity is stored separately.

### 10.3 Ticket Category Rule

A ticket's category is fixed once purchased. Changing Standard into VIP after payment is not supported.

### 10.4 Temporary Reservations

Use transactional inventory reservation to prevent overselling. A **10-minute hold** is a proposed default and must be validated against Finik payment timing. Expired holds are released. Delayed payment notifications must be reconciled safely without issuing capacity-exceeding tickets.

### 10.5 Order Statuses

Suggested states: `PENDING_PAYMENT`, `PAID`, `PAYMENT_FAILED`, `EXPIRED`, `CANCELLATION_REQUESTED`, `CANCELLED`. Financial refund states must be tracked separately.

---

## 11. Finik Payment Integration

### 11.1 Requirements

- Payment creation must occur through the backend.
- Server-side credentials must never be exposed to clients.
- Verify provider webhook authenticity and match provider payment details to the expected order, amount, and currency.
- Do not treat a successful browser redirect as proof of payment.
- Process duplicate or out-of-order callbacks idempotently.
- Generate tickets only after confirmed payment.
- Record provider transaction references, status, amounts, and timestamps.

### 11.2 Payment States

Suggested internal states: `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `EXPIRED`, `REFUND_PENDING`, `REFUNDED` (mapped to actual supported provider events).

Monetary values must use exact decimal/minor-unit storage rather than floating-point arithmetic.

### 11.3 Refunds

**Not finalized.** The platform must support recording cancellation approval and refund progress, but automatic refunds must not be assumed until the business policy and Finik capabilities are verified.

---

## 12. Unique QR Tickets and Check-in

### 12.1 Ticket Data

Each ticket stores: unique ID, forum, purchasing account, participant first/last name, ticket category, payment/order association, QR token reference, expiration time, and status.

QR payloads must **not contain plain personal data**. Use an unpredictable protected token or server-resolvable link.

### 12.2 Ticket Display

When opened by authorized staff, ticket verification shows:

- Participant first and last name.
- Forum name, date, and summary.
- Ticket category and identifier.
- A highly visible green **PAID** indicator for a valid paid ticket.
- QR expiration time.
- Current admission status.

### 12.3 Admission Rules

A ticket can be admitted only when payment is confirmed, the ticket belongs to the selected forum, is not cancelled, has not expired, and has not already been used.

The admission action must **atomically** set the ticket to used and record operator ID and check-in time. If two operators scan the same token simultaneously, **only one succeeds**.

Display clear failures:

- `TICKET ALREADY USED`
- `TICKET CANCELLED`
- `INVALID TICKET`
- `WRONG FORUM`
- `QR CODE EXPIRED`

The customer does **not** need to present an identity document for normal QR-based entry. Possession of a valid unused QR is sufficient; this creates a known risk if a QR screenshot is shared.

### 12.4 QR Expiration UI

The administrator sets a precise expiration timestamp, e.g., **November 21, 2026, 20:00** (forum time zone). At and after that time, admission must fail and the QR verification page must show a **black background** with the message **QR CODE EXPIRED**. The QR image itself does not have to change.

### 12.5 Staff Scanner

The scanner must work on supported phone cameras and display result, participant, category, and timestamp. Staff choose or are assigned the relevant forum. Check-in statistics update in the Admin Panel.

### 12.6 Internet Outage Fallback

If internet is unavailable, an attendee may present a payment receipt from MBank, O!Dengi, or the payment application used. Staff may provisionally admit the attendee under an **exceptional offline procedure**:

1. Inspect the receipt and relevant identifying information.
2. Record the person, event, receipt/transaction reference, staff member, and time in a local/manual provisional-admission log.
3. Mark the admission as **unverified**, not as a successful QR validation.
4. Reconcile records against orders and check-ins once connectivity returns.
5. Flag duplicate receipts or unmatched payments for review.

**Risk:** A receipt alone cannot securely prove ticket ownership or uniqueness. Backup mobile internet is recommended. No guaranteed automatic offline authorization is implied.

---

## 13. Telegram Integration

### 13.1 Linking

User clicks **Connect Telegram**, opens the bot with a secure one-time linking token, and initiates the bot conversation. The backend verifies the token and stores the user's chat identifier.

### 13.2 Ticket Delivery

After confirmed payment, send each QR ticket with participant name, forum, event date, category, ticket number, and expiration time to the linked Telegram account.

Use asynchronous delivery with retries and delivery logging. The account dashboard remains the authoritative fallback if Telegram is disconnected or unavailable.

---

## 14. Cancellation Workflow

1. User selects **Cancel Order** and confirms the action.
2. Display: **Your request has been submitted.**
3. The request appears at **Admin → Orders → Cancellation Requests**.
4. Admin reviews it and approves or rejects it.
5. A request awaiting review does **not** automatically invalidate the ticket.
6. When the applicable cancellation action is confirmed, affected tickets are invalidated; they cannot be checked in.
7. Eligible released ticket slots become available for replacement purchases, subject to forum capacity and per-account limit.
8. Any financial refund is tracked independently using its own status.

Suggested request states: `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `COMPLETED`.

**Open decision:** Whether cancellation is performed for an entire order, individual tickets, or both; and exact refund eligibility and processing rules.

---

## 15. Notifications

- Publishing a forum must create notifications for **all registered users**.
- Other events: confirmed payment, ticket issued, changed forum date/venue, event cancellation, cancellation-request decisions, and configured reminders.
- Support an in-app notification center.
- Use Telegram for linked users and Web Push when permission and platform support are available.
- Deliver bulk messages asynchronously via BullMQ with retries, rate-limit handling, and delivery status.
- Prefer the user's selected language and respect notification controls where applicable.

A notification delivery failure must not reverse a confirmed payment or invalidate a ticket.

---

## 16. Progressive Web App

- Responsive, installable web application.
- Web App Manifest with name and icons.
- Service Worker and safe offline fallback page.
- Web Push notifications on supported browsers and devices after user consent.
- Mobile-friendly access to forums, orders, tickets, and profile.
- Do **not** promise offline payment completion or real-time QR validation without backend connectivity.

---

## 17. Localization

| Locale | Language | Behavior |
|---|---|---|
| `ru` | Russian | **Default** for first-time visitors |
| `ky` | Kyrgyz | User-selectable |
| `en` | English | User-selectable |

- Show a `RU / KY / EN` selector on public and user pages.
- Persist the chosen language across visits.
- Localize navigation, buttons, validation messages, ticket statuses, notifications, and public content.
- Allow admins to enter forum titles, descriptions, and programs in all three languages.
- When an event translation is missing, fall back to Russian.
- Admin Panel may launch in Russian, but should be translation-ready.

---

## 18. Data Model (Proposed)

| Entity | Key purpose |
|---|---|
| `users` | Accounts and profile data |
| `auth_identities` | Linked Google/other login identities |
| `phone_verifications` | OTP verification lifecycle |
| `user_preferences` | Language and notification preferences |
| `forums` | Forum schedule, capacity, publication state, QR expiration |
| `forum_translations` | `ru`, `ky`, `en` event content |
| `ticket_categories` | Category name, price, allocation |
| `orders` | Purchasing account, amount, order status |
| `order_items` | Category, participant identity, quantity/line item |
| `payments` | Finik transaction attempts, confirmations, refunds |
| `tickets` | Issued individual tickets and QR-token reference |
| `check_ins` | Successful single-use admission records |
| `cancellation_requests` | User requests and admin decisions |
| `notifications` | In-app notifications |
| `notification_deliveries` | External send attempts/status |
| `telegram_connections` | Linked Telegram chat IDs |
| `push_subscriptions` | Push delivery subscriptions |
| `staff_roles` | Admin, manager, and scanner permissions |
| `site_settings` | Editable name, theme, content, links |
| `integration_health` | Integration configuration and check status |
| `audit_logs` | Sensitive administrative action history |
| `offline_admissions` | Provisional receipt-based admissions |

### 18.1 Integrity Constraints

- Unique verified phone number per account.
- Globally unique ticket QR tokens.
- Appropriate uniqueness constraints for provider payment IDs.
- Maximum one **successful** check-in per ticket.
- Foreign keys tying tickets to forum, order item, and purchaser.
- Transactional enforcement of capacity and account limits.

---

## 19. API Requirements

Expose versioned REST APIs with OpenAPI documentation. Suggested groups:

```text
/api/v1/auth
/api/v1/profile
/api/v1/users
/api/v1/forums
/api/v1/ticket-categories
/api/v1/orders
/api/v1/payments
/api/v1/tickets
/api/v1/check-ins
/api/v1/cancellation-requests
/api/v1/notifications
/api/v1/telegram
/api/v1/admin
/api/v1/settings
/api/v1/integrations
```

Payment callbacks must use dedicated verified webhook endpoints. Backend validation and authorization are mandatory even when the frontend already validates inputs.

---

## 20. Security, Reliability, and Operations

### 20.1 Security

- HTTPS for all production traffic.
- Secure sessions and role-based access control.
- Input validation and protection from common web vulnerabilities.
- OTP rate limiting and expiration.
- Provider webhook signature verification and idempotency.
- Secrets in protected environment/configuration management.
- Server-side payment and QR validation.
- Audit logging for staff actions.
- Appropriate handling of personal data and access permissions.

### 20.2 Reliability

- Neon connections must be configured appropriately for serverless PostgreSQL, including pooled connections where suitable.
- Use transactions for payment finalization, inventory allocation, and QR check-in.
- Background jobs must be retry-safe and observable.
- Configure database backup/recovery and restoration tests.
- Monitor errors, failed jobs, payment callbacks, Telegram/SMS delivery, and database connectivity.

### 20.3 Performance Targets (Proposed, Not Yet Approved)

| Metric | Initial engineering target |
|---|---|
| Typical core API latency | p95 under 500 ms under agreed test load |
| Online QR validation | p95 under 1 second under agreed scan load |
| Ticket capacity | Never oversell, including under concurrency |
| Duplicate scans | Never approve more than one check-in per ticket |
| Supported forum size | 50–1,000 attendee forums |

These targets must be validated through load testing with a formally defined concurrent-user scenario.

---

## 21. Testing and Acceptance Criteria

### 21.1 Required Test Scenarios

- Google login followed by mandatory phone verification.
- OTP expiry, retries, and duplicate account controls.
- Creating, scheduling, publishing, editing, and cancelling forums.
- Default one-ticket limit and configurable per-forum limits.
- Separate participant names on multiple tickets.
- Concurrent purchase attempts for the final available ticket.
- Finik payment success/failure and duplicate/delayed webhooks.
- Unique QR generation only after verified payment.
- First QR scan succeeds; repeat and simultaneous scans fail.
- Expired, cancelled, invalid, and wrong-forum ticket scans fail.
- Cancellation submission appears in the Admin Panel.
- Cancelled ticket releases purchase allowance when applicable.
- Date-only filtering on the payment history screen.
- Forum publication creates notifications for registered users.
- Ticket availability in dashboard without Telegram connection.
- Russian default locale and working Kyrgyz/English interfaces.
- PWA installation, consent-based push, and offline fallback.
- Manual/provisional admissions can be reconciled after connectivity restoration.

### 21.2 Release Acceptance

The release is acceptable when all critical business workflows above work end-to-end in a production-like environment, permissions and security checks pass, payment and check-in concurrency tests pass, and agreed load targets are met.

---

## 22. Proposed Delivery Phases

1. **Foundation:** monorepo, Next.js/NestJS setup, Neon/Prisma, roles, authentication, i18n.
2. **Content & Forums:** landing page, admin forum creation, categories, capacities, publication.
3. **Orders & Payments:** participant forms, reservations, Finik, payment records.
4. **Tickets & Entry:** QR generation, expiration, staff scanner, atomic check-in, attendance dashboard.
5. **Communication & PWA:** Telegram account linking, QR delivery, notifications, Web Push, installation.
6. **Operations & QA:** cancellation handling, integration monitoring, audit logs, security and load testing, deployment.

These are suggested phases and **not committed dates**.

---

## 23. Open Decisions / Items to Confirm

1. **Refund policy:** manual versus Finik-assisted refunds; eligibility, timing, and fees.
2. **Cancellation granularity:** entire order, individual tickets, or both.
3. **SMS provider:** Kyrgyz phone-number coverage, pricing, and service-level expectations.
4. **Hosting:** frontend/backend/worker provider and deployment region.
5. **AI integration:** whether an AI service is needed and its actual use case.
6. **Offline admission:** who authorizes receipt-based entry and the exact reconciliation process.
7. **Participant information:** whether names can be corrected after purchase.
8. **Payment timing:** reservation expiry and handling of late confirmed payments.
9. **Sales window:** whether booking closes at forum start or another configured time.
10. **Financial compliance:** receipts, tax/fiscal documentation, and data retention requirements.
11. **Ticket management:** whether partially cancelling one ticket from a multi-ticket order is allowed.

These items must be resolved before their respective production workflows are signed off; unapproved functionality must not be silently assumed.

---

## 24. Final Outcome

FORUM.KG will provide an integrated, multilingual system through which organizers can publish forums, sell Standard/VIP tickets, receive Finik payments, issue individual Telegram-delivered QR tickets, and supervise event admission and attendance. The first release will use **Next.js + TypeScript + Tailwind CSS + NestJS + Prisma + Neon Serverless PostgreSQL**, supported by Redis/BullMQ, Telegram, and PWA capabilities.

**End of Specification — Version 1.0**
