# Feature Specification: Payment System for Tournament Registration Deposits

**Created**: January 29, 2026
**Status**: Draft
**Priority**: P1

## Overview

This specification defines the payment system that allows tournament organizers to require registration deposits (señas) for tournament enrollments. The system will integrate payment processing capabilities to handle deposits, refunds, and payment tracking.

## User Scenarios & Testing

### User Story 1 - Tournament Organizer Configures Deposit Requirements (Priority: P1)

As a tournament organizer, I want to configure whether my tournament requires a registration deposit and set the deposit amount so that I can ensure commitment from participants and cover tournament costs.

**Why this priority**: Core functionality required for organizers to manage tournament finances and participant commitment.

**Independent Test**: Can be tested by creating/editing a tournament and configuring deposit settings, then verifying the settings are saved and displayed correctly.

**Acceptance Scenarios**:

1. **Scenario**: Enable deposit requirement for a tournament
   - **Given** I am creating or editing a tournament
   - **When** I enable the "Require deposit" option and set an amount (e.g., $500 ARS)
   - **Then** The tournament is saved with deposit requirements and players see the deposit amount when enrolling

2. **Scenario**: Configure deposit deadline
   - **Given** I am configuring tournament deposit settings
   - **When** I set a deadline for deposit payment (e.g., 48 hours after enrollment approval)
   - **Then** Players must complete payment within the deadline or their enrollment is automatically cancelled

3. **Scenario**: Set partial vs full payment
   - **Given** I am configuring tournament fees
   - **When** I set a deposit amount that is less than the total tournament fee
   - **Then** Players can pay the deposit to secure their spot and pay the remainder later

---

### User Story 2 - Player Pays Registration Deposit (Priority: P1)

As a player, I want to pay the required registration deposit after my enrollment is approved so that I can secure my spot in the tournament.

**Why this priority**: Essential for players to complete their tournament registration when deposits are required.

**Independent Test**: Can be tested by submitting an enrollment, getting approved, and completing the payment flow.

**Acceptance Scenarios**:

1. **Scenario**: Pay deposit after enrollment approval
   - **Given** My enrollment request has been approved and a deposit is required
   - **When** I receive the approval notification and click "Pay Deposit"
   - **Then** I am redirected to the payment gateway to complete the payment

2. **Scenario**: View payment status
   - **Given** I have submitted a payment
   - **When** I view my enrollment details
   - **Then** I can see the payment status (pending, completed, failed, refunded)

3. **Scenario**: Receive payment confirmation
   - **Given** I have completed the deposit payment
   - **When** The payment is processed successfully
   - **Then** I receive a confirmation notification and my enrollment status changes to "confirmed"

4. **Scenario**: Payment deadline warning
   - **Given** My enrollment is approved but I haven't paid the deposit
   - **When** The payment deadline is approaching (e.g., 12 hours remaining)
   - **Then** I receive a reminder notification to complete the payment

---

### User Story 3 - Organizer Manages Payments and Refunds (Priority: P1)

As a tournament organizer, I want to view all payment transactions and process refunds when necessary so that I can manage tournament finances effectively.

**Why this priority**: Critical for organizers to track revenue and handle cancellations/refunds.

**Independent Test**: Can be tested by viewing payment reports and processing a refund for a cancelled enrollment.

**Acceptance Scenarios**:

1. **Scenario**: View payment dashboard
   - **Given** I am a tournament organizer
   - **When** I navigate to the tournament payment section
   - **Then** I can see all payments (pending, completed, failed) with player details and amounts

2. **Scenario**: Process full refund
   - **Given** A player needs to withdraw before the tournament starts
   - **When** I approve the withdrawal and process a full refund
   - **Then** The payment is refunded and the player is notified

3. **Scenario**: Process partial refund
   - **Given** A player withdraws close to the tournament date
   - **When** I process a partial refund according to the cancellation policy
   - **Then** The partial amount is refunded and the player is notified

4. **Scenario**: Export payment report
   - **Given** I need financial records for the tournament
   - **When** I export the payment report
   - **Then** I receive a CSV/PDF with all transaction details

---

### User Story 4 - Team Payment (Priority: P1)

As a player, I want to be able to pay the deposit for my entire team so that my partner doesn't have to worry about the payment process.

**Why this priority**: Important for user experience and reducing friction in the enrollment process.

**Independent Test**: Can be tested by having one team member complete payment for both players.

**Acceptance Scenarios**:

1. **Scenario**: Pay for entire team
   - **Given** My enrollment is approved and requires a deposit
   - **When** I choose to pay for the entire team
   - **Then** The system charges me the full amount and marks both players as confirmed

2. **Scenario**: Split payment option
   - **Given** My enrollment is approved
   - **When** I view payment options
   - **Then** I can choose to pay my share or the full team amount

3. **Scenario**: Partner notification
   - **Given** I paid for the entire team
   - **When** Payment is confirmed
   - **Then** My partner receives a notification that payment was completed

---

### User Story 5 - System Handles Payment Failures and Retries (Priority: P2)

As a player, I want to be able to retry payment if my initial attempt fails so that I don't lose my tournament spot due to temporary payment issues.

**Why this priority**: Important for user experience and reducing enrollment cancellations due to payment issues.

**Independent Test**: Can be tested by simulating payment failures and verifying retry mechanisms.

**Acceptance Scenarios**:

1. **Scenario**: Payment fails
   - **Given** I attempt to pay the deposit
   - **When** The payment fails (insufficient funds, card declined, etc.)
   - **Then** I see an error message and can retry the payment

2. **Scenario**: Multiple payment attempts
   - **Given** My first payment attempt failed
   - **When** I retry the payment with a different payment method
   - **Then** The system processes the new attempt without creating duplicate enrollments

3. **Scenario**: Automatic cancellation after failed payments
   - **Given** I have failed to pay within the deadline after multiple attempts
   - **When** The payment deadline expires
   - **Then** My enrollment is automatically cancelled and the spot becomes available

---

## Requirements

### Functional Requirements

**Payment Configuration**
- **FR-P001**: Tournament organizers MUST be able to enable/disable deposit requirements for each tournament
- **FR-P002**: Tournament organizers MUST be able to set deposit amount in local currency (ARS)
- **FR-P003**: Tournament organizers MUST be able to set payment deadline (hours after approval)
- **FR-P004**: System MUST support both full payment and deposit+remainder payment models
- **FR-P005**: Tournament organizers MUST be able to configure cancellation/refund policies
- **FR-P006**: System MUST apply a configurable platform fee to all payments (fixed % for MVP)

**Payment Processing**
- **FR-P007**: System MUST integrate with a payment gateway (Mercado Pago recommended for Argentina)
- **FR-P008**: System MUST support multiple payment methods (credit/debit cards, digital wallets)
- **FR-P009**: System MUST generate unique payment links for each enrollment
- **FR-P010**: System MUST track payment status (pending, processing, completed, failed, refunded)
- **FR-P011**: System MUST send payment confirmation emails/notifications
- **FR-P012**: System MUST handle payment webhooks from the payment gateway
- **FR-P013**: System MUST store payment transaction IDs and metadata securely
- **FR-P014**: System MUST support team payment (one player pays for entire team)
- **FR-P015**: System MUST support split payment (each player pays their share)

**Enrollment Status Management**
- **FR-P016**: Enrollment status MUST change from "approved" to "payment_pending" when deposit is required
- **FR-P017**: Enrollment status MUST change to "confirmed" after successful payment
- **FR-P018**: System MUST automatically cancel enrollments if payment is not completed within deadline
- **FR-P019**: System MUST send automatic reminders at 24h, 12h, and 2h before payment deadline
- **FR-P020**: System MUST notify both team members when payment deadline is approaching
- **FR-P021**: System MUST prevent duplicate payments for the same enrollment
- **FR-P022**: System MUST mark entire team as confirmed when team payment is completed

**Refund Management**
- **FR-P023**: Tournament organizers MUST be able to initiate full or partial refunds
- **FR-P024**: System MUST track refund status and amounts
- **FR-P025**: System MUST notify all team members when refunds are processed
- **FR-P026**: Refunds MUST be processed to the original payer only
- **FR-P027**: System MUST handle platform fee refunds according to refund policy

**Financial Reporting**
- **FR-P028**: Tournament organizers MUST be able to view payment dashboard with all transactions
- **FR-P029**: System MUST provide payment reports (total collected, pending, refunded, platform fees)
- **FR-P030**: System MUST allow export of payment data in CSV/PDF format
- **FR-P031**: System MUST track payment gateway fees, platform fees, and net revenue
- **FR-P032**: System MUST provide separate reporting for organizer revenue and platform revenue

### Non-Functional Requirements

**Security**
- **NFR-P001**: Payment data MUST be transmitted over HTTPS with TLS 1.3+
- **NFR-P002**: System MUST NOT store complete credit card numbers (PCI DSS compliance)
- **NFR-P003**: Payment gateway tokens MUST be encrypted at rest
- **NFR-P004**: System MUST implement rate limiting on payment endpoints
- **NFR-P005**: System MUST log all payment transactions for audit purposes

**Performance**
- **NFR-P006**: Payment page MUST load within 2 seconds
- **NFR-P007**: Payment webhook processing MUST complete within 5 seconds
- **NFR-P008**: System MUST handle concurrent payments without race conditions

**Reliability**
- **NFR-P009**: System MUST implement idempotency for payment operations
- **NFR-P010**: System MUST retry failed webhook deliveries with exponential backoff
- **NFR-P011**: System MUST maintain payment state consistency even during failures

**Usability**
- **NFR-P012**: Payment flow MUST be mobile-responsive
- **NFR-P013**: Payment instructions MUST be available in Spanish, English, and Portuguese
- **NFR-P014**: Payment status MUST be clearly visible in the user interface

---

## Key Entities

### Payment
Represents a payment transaction for a tournament enrollment.

**Attributes**:
- `id` (UUID): Unique identifier
- `enrollmentId` (UUID): Reference to tournament registration
- `amount` (Decimal): Payment amount in local currency
- `platformFee` (Decimal): Platform fee amount
- `gatewayFee` (Decimal): Payment gateway fee
- `netAmount` (Decimal): Net amount to organizer
- `currency` (String): Currency code ("ARS" for MVP)
- `status` (Enum): pending | processing | completed | failed | refunded | partially_refunded
- `paymentType` (Enum): full_team | split | deposit | full_fee
- `paidBy` (UUID): User who made the payment
- `paymentMethod` (String): Type of payment method used
- `paymentGateway` (String): Gateway used (e.g., "mercadopago")
- `externalTransactionId` (String): Transaction ID from payment gateway
- `paymentUrl` (String): URL for payment completion
- `paidAt` (Timestamp): When payment was completed
- `expiresAt` (Timestamp): Payment deadline
- `metadata` (JSON): Additional payment gateway data
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relations**:
- Belongs to one TournamentRegistration (N:1)
- Has many PaymentEvents (1:N)
- Has many Refunds (1:N)

### PaymentEvent
Represents events in the payment lifecycle (for audit trail).

**Attributes**:
- `id` (UUID): Unique identifier
- `paymentId` (UUID): Reference to payment
- `eventType` (Enum): created | initiated | processing | completed | failed | refund_initiated | refunded
- `eventData` (JSON): Event-specific data
- `createdAt` (Timestamp)

**Relations**:
- Belongs to one Payment (N:1)

### Refund
Represents a refund transaction.

**Attributes**:
- `id` (UUID): Unique identifier
- `paymentId` (UUID): Reference to original payment
- `amount` (Decimal): Refund amount
- `reason` (String): Reason for refund
- `status` (Enum): pending | processing | completed | failed
- `externalRefundId` (String): Refund ID from payment gateway
- `initiatedBy` (UUID): User who initiated the refund
- `processedAt` (Timestamp): When refund was completed
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relations**:
- Belongs to one Payment (N:1)
- Belongs to one User (initiatedBy) (N:1)

### TournamentSettings (Extended)
Add payment-related settings to existing TournamentSettings interface.

**New Attributes**:
- `requiresDeposit` (Boolean): Whether deposit is required
- `depositAmount` (Decimal): Deposit amount in local currency
- `depositCurrency` (String): Currency code ("ARS" for MVP)
- `totalFee` (Decimal): Total tournament fee (if different from deposit)
- `paymentDeadlineHours` (Number): Hours after approval to complete payment
- `allowTeamPayment` (Boolean): Whether one player can pay for entire team (default: true)
- `allowSplitPayment` (Boolean): Whether players can pay separately (default: true)
- `platformFeePercentage` (Decimal): Platform fee percentage (configurable, default: 5.0)
- `refundPolicy` (Object):
  - `fullRefundDeadlineHours` (Number): Hours before tournament for full refund
  - `partialRefundPercentage` (Number): Percentage refunded after full refund deadline
  - `noRefundDeadlineHours` (Number): Hours before tournament when no refunds are given
  - `refundPlatformFee` (Boolean): Whether to refund platform fee (default: false)

---

## Database Schema Changes

### New Tables

```sql
-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES tournament_registrations(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  gateway_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'ARS',
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  payment_type VARCHAR(20) NOT NULL DEFAULT 'full_team',
  paid_by UUID NOT NULL REFERENCES users(id),
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50) NOT NULL,
  external_transaction_id VARCHAR(255),
  payment_url TEXT,
  paid_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
  CONSTRAINT valid_payment_type CHECK (payment_type IN ('full_team', 'split', 'deposit', 'full_fee'))
);

CREATE INDEX idx_payments_enrollment ON payments(enrollment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_external_id ON payments(external_transaction_id);

-- Payment events table (audit trail)
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_events_payment ON payment_events(payment_id);
CREATE INDEX idx_payment_events_type ON payment_events(event_type);

-- Refunds table
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  external_refund_id VARCHAR(255),
  initiated_by UUID NOT NULL REFERENCES users(id),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_refund_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);
```

### Modified Tables

```sql
-- Add payment settings to tournaments table
ALTER TABLE tournaments 
ADD COLUMN payment_settings JSONB DEFAULT '{}';

-- Add payment-related status to tournament_registrations
-- Update status enum to include: pending, approved, payment_pending, confirmed, rejected, withdrawn, cancelled
```

---

## API Endpoints

### Tournament Payment Configuration

```
PUT /api/tournaments/:tournamentId/payment-settings
Authorization: Bearer token (organizer only)
Body: {
  requiresDeposit: boolean,
  depositAmount: number,
  depositCurrency: string,
  totalFee?: number,
  paymentDeadlineHours: number,
  refundPolicy: {
    fullRefundDeadlineHours: number,
    partialRefundPercentage: number,
    noRefundDeadlineHours: number
  }
}
Response: Tournament
```

### Payment Initiation

```
POST /api/enrollments/:enrollmentId/payment
Authorization: Bearer token
Response: {
  paymentId: string,
  paymentUrl: string,
  amount: number,
  currency: string,
  expiresAt: string
}
```

### Payment Status

```
GET /api/payments/:paymentId
Authorization: Bearer token
Response: Payment
```

### Payment Webhook (from payment gateway)

```
POST /api/webhooks/payments/:gateway
Body: (gateway-specific payload)
Response: 200 OK
```

### Payment Dashboard (Organizer)

```
GET /api/tournaments/:tournamentId/payments
Authorization: Bearer token (organizer only)
Query params: ?status=completed&page=1&limit=20
Response: {
  payments: Payment[],
  summary: {
    totalCollected: number,
    totalPending: number,
    totalRefunded: number,
    netRevenue: number
  },
  pagination: {...}
}
```

### Refund Initiation

```
POST /api/payments/:paymentId/refund
Authorization: Bearer token (organizer only)
Body: {
  amount: number,
  reason: string
}
Response: Refund
```

### Payment Report Export

```
GET /api/tournaments/:tournamentId/payments/export
Authorization: Bearer token (organizer only)
Query params: ?format=csv|pdf
Response: File download
```

---

## Payment Gateway Integration

### Recommended: Mercado Pago (Argentina)

**Reasons**:
- Most popular payment gateway in Argentina
- Supports multiple payment methods (cards, bank transfers, Mercado Pago wallet)
- Good API documentation and SDKs
- Competitive fees
- Strong fraud prevention

**Integration Steps**:
1. Create Mercado Pago developer account
2. Obtain API credentials (access token)
3. Install Mercado Pago SDK for Node.js
4. Implement payment preference creation
5. Handle payment notifications via webhooks
6. Implement refund API calls

**Alternative Options**:
- **Stripe**: International option, good for future expansion
- **TodoPago**: Local Argentine option
- **Payway**: Another local option

---

## Payment Flow Diagrams

### Enrollment with Deposit Flow

```
1. Player submits enrollment request
   ↓
2. Organizer approves enrollment
   ↓
3. System checks if deposit is required
   ↓ (if yes)
4. System creates Payment record (status: pending)
   ↓
5. System generates payment link via gateway
   ↓
6. System updates enrollment status to "payment_pending"
   ↓
7. System notifies player with payment link
   ↓
8. Player clicks link and completes payment
   ↓
9. Payment gateway processes payment
   ↓
10. Gateway sends webhook to system
    ↓
11. System updates Payment status to "completed"
    ↓
12. System updates enrollment status to "confirmed"
    ↓
13. System notifies player of confirmation
```

### Refund Flow

```
1. Player requests withdrawal OR organizer cancels tournament
   ↓
2. Organizer initiates refund
   ↓
3. System creates Refund record
   ↓
4. System calls payment gateway refund API
   ↓
5. Gateway processes refund
   ↓
6. Gateway sends webhook confirmation
   ↓
7. System updates Refund status to "completed"
   ↓
8. System updates Payment status to "refunded" or "partially_refunded"
   ↓
9. System notifies player of refund
```

---

## Edge Cases & Error Handling

### Payment Failures
- **Insufficient funds**: Allow retry with different payment method
- **Card declined**: Show clear error message and retry option
- **Gateway timeout**: Implement retry logic with exponential backoff
- **Duplicate payment attempts**: Use idempotency keys to prevent double charging

### Deadline Management
- **Payment deadline expires**: Automatically cancel enrollment and free the spot
- **Player pays after deadline**: Reject payment and show error message
- **Organizer extends deadline**: Update payment expiration time

### Refund Scenarios
- **Partial refund calculation**: Apply refund policy based on time until tournament
- **Refund to closed account**: Handle gateway errors gracefully
- **Multiple refund requests**: Prevent duplicate refunds for same payment

### Concurrent Operations
- **Multiple payments for same enrollment**: Use database locks to prevent race conditions
- **Enrollment cancelled while payment processing**: Handle webhook for cancelled enrollment
- **Tournament cancelled with pending payments**: Automatically refund all payments

### Data Consistency
- **Webhook received before payment record created**: Queue webhook and retry
- **Webhook never received**: Implement payment status polling as fallback
- **Gateway webhook fails**: Retry webhook delivery with exponential backoff

---

## Security Considerations

### PCI DSS Compliance
- Never store full credit card numbers
- Use payment gateway's hosted payment page or tokenization
- Implement proper access controls for payment data
- Maintain audit logs of all payment operations

### Fraud Prevention
- Implement rate limiting on payment endpoints
- Monitor for suspicious payment patterns
- Use payment gateway's fraud detection features
- Require authentication for all payment operations

### Data Protection
- Encrypt sensitive payment data at rest
- Use HTTPS for all payment communications
- Implement proper session management
- Sanitize all user inputs

---

## Testing Strategy

### Unit Tests
- Payment creation and validation
- Payment status transitions
- Refund calculations
- Deadline expiration logic

### Integration Tests
- Payment gateway API integration
- Webhook handling
- Database transactions
- Email/notification sending

### E2E Tests
- Complete enrollment with payment flow
- Payment failure and retry
- Refund processing
- Deadline expiration and cancellation

### Manual Testing
- Test with payment gateway sandbox
- Verify all payment methods work
- Test on mobile devices
- Verify email notifications

---

## Rollout Plan

### Phase 1: Core Payment Infrastructure (Week 1-2)
- Database schema changes
- Payment entity and repository
- Basic payment service
- Payment gateway integration (Mercado Pago)

### Phase 2: Payment Flow Implementation (Week 2-3)
- Payment initiation endpoint
- Webhook handling
- Payment status tracking
- Enrollment status updates

### Phase 3: Refund System (Week 3-4)
- Refund entity and repository
- Refund service
- Refund API endpoints
- Refund notifications

### Phase 4: UI/UX (Week 4-5)
- Payment configuration UI for organizers
- Payment page for players
- Payment status display
- Payment dashboard for organizers

### Phase 5: Testing & Polish (Week 5-6)
- Comprehensive testing
- Security audit
- Performance optimization
- Documentation

---

## Success Metrics

### Technical Metrics
- Payment success rate > 95%
- Payment processing time < 5 seconds
- Webhook processing time < 3 seconds
- Zero payment data breaches

### Business Metrics
- % of tournaments using deposit feature
- Average deposit amount
- Payment completion rate
- Refund rate
- Time to payment completion

### User Experience Metrics
- Payment flow completion rate
- Payment retry rate
- User satisfaction with payment process
- Support tickets related to payments

---

## Product Decisions

### Confirmed Features (MVP)
1. ✅ **No installment payments** - Single payment only (deposit or full amount)
2. ✅ **Organizer-defined amounts** - Each organizer sets their own deposit and total fee amounts
3. ✅ **Automatic payment reminders** - System sends reminders as deadline approaches
4. ✅ **Team payment support** - One team member can pay for the entire team/pair enrollment
5. ✅ **Platform fee** - Configurable by plans, fixed percentage for MVP (e.g., 5%)
6. ❌ **No wallet system** - Direct payments only
7. ❌ **No currency conversion** - ARS only for MVP
8. ❌ **No offline payment methods** - Online payments through gateway only

### Future Considerations
- Multi-currency support for international expansion
- Wallet/credits system for frequent players
- Offline payment reconciliation
- Installment plans for high-value tournaments

---

## Dependencies

### External Services
- Mercado Pago API (or alternative payment gateway)
- Email service (for payment notifications)
- SMS service (optional, for payment reminders)

### Internal Dependencies
- Tournament management system
- Enrollment system
- Notification system
- User authentication system

---

## Future Enhancements

### Phase 2 Features (Post-MVP)
- Early bird discounts
- Group enrollment discounts
- Payment analytics dashboard
- Automated reconciliation with bank statements
- Advanced platform fee models (tiered, subscription-based)
- Payment receipt generation with tax information

### Phase 3 Features (Future)
- Multi-currency support for international tournaments
- International payment gateways (Stripe for global expansion)
- Payment plans and installments for high-value tournaments
- Wallet/credits system for frequent players
- Offline payment reconciliation
- Sponsor payment integration
- Prize money distribution system
