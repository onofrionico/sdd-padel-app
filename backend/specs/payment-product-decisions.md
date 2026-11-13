# Product Decisions: Payment System for Tournament Registrations

**Date**: January 29, 2026
**Status**: Approved for MVP Implementation
**Version**: 1.0

---

## Executive Summary

This document captures the key product decisions made for the payment system feature that will allow tournament organizers to require registration deposits (señas) from players. These decisions define the scope of the MVP and guide the implementation team.

---

## Approved Features for MVP

### 1. ✅ Single Payment Model (No Installments)

**Decision**: The MVP will support only single payments - either a deposit or full tournament fee. No installment plans.

**Rationale**:
- Simplifies implementation significantly
- Reduces complexity in payment tracking and reconciliation
- Most tournaments in Argentina use single payment model
- Can be added in future if user demand exists

**Implementation Impact**:
- No need for recurring payment logic
- Simpler payment state machine
- Easier reconciliation and reporting

---

### 2. ✅ Organizer-Defined Amounts

**Decision**: Each tournament organizer can set their own deposit amount and total tournament fee. No platform-wide standardization.

**Rationale**:
- Different tournaments have different cost structures
- Organizers know their market and costs best
- Flexibility is key for adoption
- Allows for competitive pricing

**Implementation Impact**:
- Payment settings stored per tournament
- UI must allow easy configuration
- Validation to ensure deposit ≤ total fee

**Configuration Options**:
- Deposit amount (ARS)
- Total tournament fee (ARS)
- Payment deadline (hours after approval)

---

### 3. ✅ Automatic Payment Reminders

**Decision**: System will automatically send payment reminders at 24 hours, 12 hours, and 2 hours before the payment deadline.

**Rationale**:
- Reduces enrollment cancellations due to forgotten payments
- Improves conversion rate
- Better user experience
- Industry standard practice

**Implementation Impact**:
- Scheduled job to check payment deadlines
- Notification system integration
- Email and in-app notifications
- Multi-language support required

**Reminder Schedule**:
- **24 hours before**: Gentle reminder with payment link
- **12 hours before**: More urgent reminder
- **2 hours before**: Final urgent reminder with clear deadline

---

### 4. ✅ Team Payment Support

**Decision**: One team member can pay the full amount for the entire team/pair enrollment.

**Rationale**:
- Common practice in padel tournaments
- Reduces friction in enrollment process
- One person often handles logistics for the team
- Improves conversion rate

**Implementation Impact**:
- Payment entity must track who paid
- Both team members marked as confirmed after payment
- Partner receives notification when payment is completed
- Clear UI to indicate payment options

**User Flow**:
1. Enrollment approved
2. Either player can choose "Pay for Team"
3. Payment processed for full amount
4. Both players marked as confirmed
5. Partner notified of completed payment

---

### 5. ✅ Split Payment Option

**Decision**: Players can also choose to pay their individual share separately.

**Rationale**:
- Some players prefer to pay their own way
- Provides flexibility
- Reduces dependency on partner's financial situation
- Fair option for casual partnerships

**Implementation Impact**:
- Track partial payments per player
- Both payments must complete before confirmation
- Handle case where one pays but other doesn't
- Clear UI showing payment status per player

**User Flow**:
1. Enrollment approved
2. Each player chooses "Pay My Share"
3. Each payment processed separately
4. Both confirmed only after both payments complete
5. Notifications sent to both players

---

### 6. ✅ Platform Fee (Configurable)

**Decision**: Platform will charge a configurable fee on all payments. Fixed at 5% for MVP, but designed to be configurable for future plans/tiers.

**Rationale**:
- Revenue model for platform sustainability
- Industry standard (5-10% typical)
- Configurable design allows for future business model changes
- Transparent to organizers

**Implementation Impact**:
- Fee calculation in payment service
- Separate tracking of platform fee vs organizer revenue
- Reporting must show breakdown
- Database fields for platform_fee, gateway_fee, net_amount

**Fee Structure (MVP)**:
- Platform fee: 5% of payment amount
- Gateway fee: Variable (Mercado Pago charges)
- Net to organizer: Payment - Platform Fee - Gateway Fee

**Future Considerations**:
- Tiered pricing (different % for different plan levels)
- Volume discounts
- Subscription-based models with lower fees

---

### 7. ✅ ARS Currency Only

**Decision**: MVP supports Argentine Pesos (ARS) only. No multi-currency support.

**Rationale**:
- Target market is Argentina initially
- Simplifies implementation significantly
- Avoids currency conversion complexity
- Mercado Pago optimized for ARS
- Can expand internationally later

**Implementation Impact**:
- Currency field defaulted to "ARS"
- No currency conversion logic needed
- Simpler reporting
- All amounts in single currency

**Future Expansion**:
- Add USD, EUR, BRL for international tournaments
- Currency conversion service integration
- Multi-currency reporting

---

### 8. ✅ Online Payments Only (Mercado Pago)

**Decision**: MVP supports only online payments through Mercado Pago. No offline payment methods (cash, bank transfer, etc.).

**Rationale**:
- Mercado Pago is most popular in Argentina
- Automated payment tracking
- Instant confirmation
- Reduced manual reconciliation
- Better user experience
- Lower fraud risk

**Implementation Impact**:
- Single payment gateway integration
- No manual payment tracking needed
- Simpler reconciliation
- Automated refunds possible

**Supported Payment Methods (via Mercado Pago)**:
- Credit cards (Visa, Mastercard, Amex)
- Debit cards
- Mercado Pago wallet
- Bank transfers (through Mercado Pago)

**Future Considerations**:
- Offline payment reconciliation for special cases
- Additional gateways (Stripe for international)
- Cash payment tracking (manual)

---

## Explicitly Out of Scope for MVP

### ❌ Installment Payments

**Reason**: Adds significant complexity. Can be added in Phase 2 if demand exists.

**Future Consideration**: For high-value tournaments (e.g., >$10,000 ARS), installments might be valuable.

---

### ❌ Wallet/Credits System

**Reason**: Requires additional infrastructure and regulatory considerations. Not essential for MVP.

**Future Consideration**: Could improve retention and reduce payment friction for frequent players.

---

### ❌ Multi-Currency Support

**Reason**: Target market is Argentina. International expansion can add this later.

**Future Consideration**: Essential for international tournaments and platform expansion.

---

### ❌ Offline Payment Methods

**Reason**: Requires manual reconciliation and tracking. Adds operational overhead.

**Future Consideration**: Some organizers may prefer cash for local tournaments. Could add as optional feature.

---

## Key User Flows

### Flow 1: Team Payment (Expected 70%+ of cases)

```
1. Player A and Player B submit enrollment
2. Organizer approves enrollment
3. Both players receive notification: "Payment Required"
4. Player A clicks "Pay for Team" button
5. Player A redirected to Mercado Pago
6. Player A completes payment
7. System receives webhook from Mercado Pago
8. Both Player A and Player B marked as "Confirmed"
9. Player B receives notification: "Your partner paid for the team"
10. Enrollment complete
```

### Flow 2: Split Payment

```
1. Player A and Player B submit enrollment
2. Organizer approves enrollment
3. Both players receive notification: "Payment Required"
4. Player A clicks "Pay My Share" button
5. Player A completes payment
6. Player A marked as "Paid" (enrollment still "Payment Pending")
7. Player B receives notification: "Your partner paid their share"
8. Player B clicks "Pay My Share" button
9. Player B completes payment
10. Both players marked as "Confirmed"
11. Enrollment complete
```

### Flow 3: Payment Deadline Expiration

```
1. Enrollment approved, payment required
2. 24 hours before deadline: Reminder sent to both players
3. 12 hours before deadline: Urgent reminder sent
4. 2 hours before deadline: Final reminder sent
5. Deadline passes without payment
6. System automatically cancels enrollment
7. Both players notified: "Enrollment cancelled - payment deadline expired"
8. Spot becomes available for other players
```

### Flow 4: Refund (Organizer-Initiated)

```
1. Player paid and confirmed
2. Player requests withdrawal OR tournament cancelled
3. Organizer reviews refund policy
4. Organizer initiates refund (full or partial)
5. System calculates refund amount based on policy
6. System processes refund through Mercado Pago
7. Refund sent to original payer
8. Both team members notified of refund
9. Enrollment status updated to "Refunded"
```

---

## Business Rules

### Payment Deadlines

- **Default**: 48 hours after enrollment approval
- **Configurable**: Organizers can set 12h to 168h (7 days)
- **Automatic Cancellation**: Enrollment cancelled if not paid by deadline
- **No Extensions**: System does not support deadline extensions (organizers must manually re-approve)

### Refund Policy

Organizers configure per tournament:

- **Full Refund Window**: e.g., 72 hours before tournament start
- **Partial Refund**: e.g., 50% if within 72-24 hours before start
- **No Refund**: e.g., less than 24 hours before start

**Platform Fee Refund**:
- Default: Platform fee NOT refunded
- Configurable per tournament
- Organizer can choose to absorb platform fee on refunds

### Platform Fee Calculation

```
Payment Amount: $1,000 ARS (example)
Platform Fee (5%): $50 ARS
Gateway Fee (varies): ~$30 ARS (3%)
Net to Organizer: $920 ARS

On Refund (if platform fee not refunded):
Refund to Player: $950 ARS (payment - platform fee)
Platform keeps: $50 ARS
```

---

## Success Metrics

### Adoption Metrics
- **Target**: 50%+ of new tournaments enable payment feature (Month 1)
- **Target**: 70%+ of tournaments with payments use team payment option

### Performance Metrics
- **Target**: >95% payment success rate
- **Target**: <5% refund rate
- **Target**: <2% enrollment cancellations due to deadline expiration

### Revenue Metrics
- **Target**: Platform fee revenue covers payment system costs within 3 months
- **Target**: Average payment amount >$500 ARS

### User Satisfaction
- **Target**: >4/5 satisfaction score for payment experience
- **Target**: <10 payment-related support tickets per week

---

## Technical Constraints

### Payment Gateway
- **MVP**: Mercado Pago only
- **Sandbox**: Required for testing
- **Webhook**: Must be publicly accessible HTTPS endpoint
- **Idempotency**: All payment operations must be idempotent

### Database
- **Currency**: All amounts stored as DECIMAL(10,2)
- **Audit Trail**: All payment events logged
- **Soft Deletes**: Payments never hard-deleted

### Security
- **PCI DSS**: No card data stored
- **Encryption**: All sensitive data encrypted at rest
- **HTTPS**: All payment communications over TLS 1.3+
- **Rate Limiting**: Payment endpoints rate-limited

---

## Open Questions & Future Decisions

### For Phase 2 Consideration

1. **Early Bird Discounts**: Should organizers be able to offer discounts for early payment?
2. **Group Discounts**: Should there be discounts for multiple team enrollments?
3. **Loyalty Program**: Should frequent players get benefits?
4. **Payment Plans**: For high-value tournaments, should we support installments?
5. **Offline Reconciliation**: Should we support manual payment entry for cash/transfer?

### For International Expansion

1. **Currency Support**: Which currencies to add first? (USD, EUR, BRL?)
2. **Payment Gateways**: Which gateways for international markets? (Stripe?)
3. **Tax Handling**: How to handle VAT/sales tax in different countries?
4. **Compliance**: What additional compliance needed per country?

---

## Approval & Sign-off

**Product Manager**: _________________ Date: _______

**Technical Lead**: _________________ Date: _______

**Business Owner**: _________________ Date: _______

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-29 | Product Team | Initial approved decisions for MVP |

---

## Related Documents

- `payment-system-spec.md` - Complete technical specification
- `payment-implementation-plan.md` - Detailed implementation plan
- `padel-tournament-spec.md` - Overall tournament system specification
