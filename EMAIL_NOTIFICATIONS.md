# Email Notifications Catalog

Authoritative list of user-facing email notifications, ordered roughly by the end‑to‑end customer journey. Each entry includes purpose, trigger, template key (current or planned), primary dynamic variables, and implementation status.

Legend:

-   Status: ✅ Implemented | 🛠 Planned / Pending | 🔍 Under Consideration
-   Template Key: corresponds to `TemplateName` (and folder filename) once implemented.

---

## 1. Acquisition & Onboarding

### 1.1 Account Verification

-   **Template Key:** `account-verify` (✅)
-   **Purpose:** Confirm ownership of email & activate account.
-   **Trigger:** User completes signup (immediate, fire-and-forget).
-   **Key Variables:** `firstName`, `verifyUrl`, `appName`.
-   **Failure Handling:** Log only; signup not blocked.
-   **Next Steps:** Add signed token & verification endpoint to finalize activation.

### 1.2 Welcome / Onboarding Guide

-   **Template Key:** `welcome` (🛠)
-   **Purpose:** Encourage first meaningful action (e.g., browse plans, complete profile).
-   **Trigger:** On successful email verification OR 24h after signup if verified.
-   **Key Variables:** `firstName`, `gettingStartedUrl`, `helpCenterUrl`.
-   **Notes:** Could be A/B tested; consider product-led upsell sections.

## 2. Access & Security

### 2.1 Password Reset Request

-   **Template Key:** `password-reset` (✅)
-   **Purpose:** Provide secure link to reset password.
-   **Trigger:** User initiates forgot password flow.
-   **Key Variables:** `firstName`, `resetUrl`, `appName`, `expiresInMinutes` (planned addition).
-   **Security Considerations:** Token one-time use; short TTL; avoid leaking whether account exists (generic success response externally).

### 2.2 Password Successfully Changed

-   **Template Key:** `password-changed` (🛠)
-   **Purpose:** Alert user to credential change; allow rollback if unauthorized.
-   **Trigger:** Password update completes.
-   **Key Variables:** `firstName`, `changeTime`, `supportUrl`.

### 2.3 New Device / New Location Login Alert

-   **Template Key:** `new-login` (🔍)
-   **Purpose:** Notify of potentially risky access.
-   **Trigger:** Auth success from unseen device+IP fingerprint.
-   **Key Variables:** `firstName`, `ipAddress`, `approxLocation`, `loginTime`, `deviceInfo`.

### 2.4 Email Change Confirmation

-   **Template Key:** `email-change` (🔍)
-   **Purpose:** Confirm intent & allow revert if not authorized.
-   **Trigger:** User initiates change of primary email.
-   **Key Variables:** `firstName`, `oldEmail`, `newEmail`, `confirmUrl`, `revertUrl`.

## 3. Profile & Account State

### 3.1 Profile Completion Reminder

-   **Template Key:** `complete-profile` (🔍)
-   **Purpose:** Drive activation; encourage adding phone or country preferences.
-   **Trigger:** 3 days post‑signup if profile < threshold completion.
-   **Key Variables:** `firstName`, `completionPercent`, `profileUrl`.

### 3.2 Marketing Preferences / Consent Update

-   **Template Key:** `consent-update` (🔍)
-   **Purpose:** Regulatory acknowledgment of changed consent settings.
-   **Trigger:** User updates communication preferences.
-   **Key Variables:** `firstName`, `changedAt`, `preferencesSummary`.

## 4. Discovery & Purchase Funnel

### 4.1 Abandoned Cart Reminder

-   **Template Key:** `cart-abandon` (🔍)
-   **Purpose:** Recover lost conversions.
-   **Trigger:** Cart inactive for N hours with unpurchased items.
-   **Key Variables:** `firstName`, `cartItems[] (planName, region, price)`, `returnUrl`.
-   **Cadence:** 1–2 reminders max.

### 4.2 Price Drop / Promotion (Opt‑In)

-   **Template Key:** `promo-offer` (🔍)
-   **Purpose:** Stimulate purchase via discount.
-   **Trigger:** Campaign-based or plan watchlist triggers.
-   **Key Variables:** `firstName`, `offerTitle`, `discountPercent`, `ctaUrl`, `expiryDate`.

## 5. Transaction & Payments

### 5.1 Payment Authorization / 3DS Challenge (if needed)

-   **Template Key:** `payment-action-required` (🔍)
-   **Purpose:** Inform user next step needed to complete payment.
-   **Trigger:** Payment provider requests additional customer action.
-   **Key Variables:** `firstName`, `actionUrl`, `orderNumber`.

### 5.2 Payment Confirmation

-   **Template Key:** `payment-confirmed` (✅)
-   **Purpose:** Acknowledge successful payment and set expectations for next steps.
-   **Trigger:** Payment provider confirms capture for an order.
-   **Key Variables:** `firstName`, `orderId`, `amount`, `currency`, `amountFormatted`, `viewOrderUrl`, `supportUrl`.
-   **Notes:** Future enhancement: attach PDF invoice once available.

### 5.3 Order Summary / Receipt

-   **Template Key:** `order-confirmation` (🛠)
-   **Purpose:** Provide detailed line items and plan activation expectations.
-   **Trigger:** Payment captured & order persisted.
-   **Key Variables:** `firstName`, `orderNumber`, `orderDate`, `items[] (planName, region, qty, total)`, `totalAmount`, `currency`, `supportUrl`.

### 5.3 Payment Failed / Retry Needed

-   **Template Key:** `payment-failed` (🔍)
-   **Purpose:** Encourage retry; reduce silent churn.
-   **Trigger:** Provider returns failure after final retry attempt.
-   **Key Variables:** `firstName`, `orderNumber`, `failureReason`, `retryUrl`.

### 5.4 Refund Processed

-   **Template Key:** `refund-issued` (🔍)
-   **Purpose:** Acknowledge refund and timeline for funds availability.
-   **Trigger:** Refund event from payment provider recorded.
-   **Key Variables:** `firstName`, `orderNumber`, `refundAmount`, `currency`, `processedAt`.

## 6. eSIM Lifecycle & Usage

### 6.1 eSIM Provisioned / Ready to Install

-   **Template Key:** `esim-ready` (🛠)
-   **Purpose:** Provide installation instructions & QR code link.
-   **Trigger:** Provider callback or internal provisioning success.
-   **Key Variables:** `firstName`, `planName`, `region`, `installGuideUrl`, `manageUrl`.

### 6.2 Usage Threshold Warning

-   **Template Key:** `usage-threshold` (🔍)
-   **Purpose:** Alert approaching data depletion (e.g., 80%).
-   **Trigger:** Usage ingestion crosses threshold.
-   **Key Variables:** `firstName`, `planName`, `dataUsed`, `dataTotal`, `percentUsed`, `topUpUrl`.

### 6.3 Balance Depleted / Plan Expired

-   **Template Key:** `plan-expired` (🔍)
-   **Purpose:** Encourage renewal or upsell alternative plan.
-   **Trigger:** Data fully consumed OR validity end date passed.
-   **Key Variables:** `firstName`, `planName`, `expiredAt`, `renewUrl`, `alternativePlansUrl`.

### 6.4 Automatic Top-Up Confirmation (if supported)

-   **Template Key:** `topup-confirmation` (🔍)
-   **Purpose:** Confirm auto top-up event and cost transparency.
-   **Trigger:** Auto top-up completes.
-   **Key Variables:** `firstName`, `planName`, `topUpAmount`, `newBalance`, `manageAutoTopUpUrl`.

## 7. Support & Compliance

### 7.1 Support Ticket Created

-   **Template Key:** `support-created` (🔍)
-   **Purpose:** Acknowledge receipt and set response expectations.
-   **Trigger:** User submits ticket.
-   **Key Variables:** `firstName`, `ticketId`, `submittedAt`, `category`, `viewTicketUrl`.

### 7.2 Support Ticket Resolved

-   **Template Key:** `support-resolved` (🔍)
-   **Purpose:** Close loop; ask for feedback / CSAT.
-   **Trigger:** Ticket status moves to resolved.
-   **Key Variables:** `firstName`, `ticketId`, `resolvedAt`, `feedbackUrl`.

### 7.3 Policy / Terms Update (Legal)

-   **Template Key:** `policy-update` (🔍)
-   **Purpose:** Notify users of material legal changes.
-   **Trigger:** Terms/Privacy version bump flagged as user-impacting.
-   **Key Variables:** `firstName`, `policyType`, `effectiveDate`, `summaryUrl`.

### 7.4 Privacy Data Export Ready

-   **Template Key:** `data-export` (🔍)
-   **Purpose:** Inform user their requested export is available.
-   **Trigger:** Background job completes data export packaging.
-   **Key Variables:** `firstName`, `downloadUrl`, `expiresAt`.

### 7.5 Account Deletion Confirmation

-   **Template Key:** `account-deleted` (🔍)
-   **Purpose:** Final confirmation & reversal window (if applicable).
-   **Trigger:** Deletion process finalizes.
-   **Key Variables:** `firstName`, `deletionDate`, `reactivationDeadline`.

---

## Summary Table

| Phase      | Template Key            | Status | Primary Trigger            |
| ---------- | ----------------------- | ------ | -------------------------- |
| Onboarding | account-verify          | ✅     | Signup completion          |
| Onboarding | welcome                 | 🛠      | Email verified / 24h delay |
| Security   | password-reset          | ✅     | Forgot password request    |
| Security   | password-changed        | 🛠      | Password updated           |
| Security   | new-login               | 🔍     | New device login           |
| Security   | email-change            | 🔍     | Email change initiated     |
| Profile    | complete-profile        | 🔍     | 3d low completion          |
| Profile    | consent-update          | 🔍     | Preferences changed        |
| Funnel     | cart-abandon            | 🔍     | Inactive cart              |
| Funnel     | promo-offer             | 🔍     | Campaign event             |
| Payments   | payment-action-required | 🔍     | 3DS / action needed        |
| Payments   | payment-confirmed       | ✅     | Payment captured           |
| Payments   | order-confirmation      | ✅     | Payment captured           |
| Payments   | payment-failed          | 🔍     | Final payment failure      |
| Payments   | refund-issued           | 🔍     | Refund processed           |
| eSIM       | usage-threshold         | 🔍     | Threshold crossed          |
| eSIM       | plan-expired            | 🔍     | Plan expired/depleted      |
| eSIM       | topup-confirmation      | 🔍     | Auto top-up done           |
| Support    | support-created         | 🔍     | Ticket created             |
| Support    | support-resolved        | 🔍     | Ticket resolved            |
| Compliance | policy-update           | 🔍     | Policy version bump        |
| Compliance | data-export             | 🔍     | Export job complete        |
| Compliance | account-deleted         | 🔍     | Account deletion finalized |

---

## Implementation Priorities (Suggested)

1. Core onboarding & security: `account-verify`, `password-reset`, `password-changed`.
2. Transactional confidence: `order-confirmation`, `payment-failed`.
3. eSIM lifecycle: `esim-ready`, `usage-threshold`, `plan-expired`.
4. Engagement & recovery: `welcome`, `cart-abandon`.
5. Support & compliance: `support-created`, `support-resolved`, legal updates.

## Technical Notes

-   All template keys should map 1:1 to MJML + text files once implemented: `templates/<locale>/<template-key>.mjml` & `text/<template-key>.txt.hbs`.
-   Subjects defined in `libs/services/email/templates.ts`; consider extracting to JSON for localization.
-   Locales: Default `en-ZA`; future expansion should replicate folder structure.
-   Consider queueing (RabbitMQ) for non-critical sends to keep request latency low.

## Open Questions

| Topic                    | Decision Needed                                            |
| ------------------------ | ---------------------------------------------------------- |
| Email verification token | JWT vs opaque DB record                                    |
| Retry strategy           | Immediate vs delayed queue retry for transient SMTP errors |
| New device detection     | Fingerprint heuristic & threshold                          |
| Abandoned cart window    | 4h? 12h? Multi-touch cadence?                              |
| Usage thresholds         | Fixed (50/80/95%) vs configurable per plan                 |

---

Updates to this document should accompany any new email template addition or change in trigger semantics.
