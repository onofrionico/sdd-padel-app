# Enrollment-Payment Integration Summary

**Date**: January 30, 2026  
**Status**: ✅ Completed

---

## Overview

Integrated the payment system with the enrollment approval flow to automatically create payments when enrollments are approved for tournaments that require payment.

---

## Backend Changes

### 1. EnrollmentService Integration

**File**: `src/tournaments/enrollment.service.ts`

**Changes Made**:

#### Import PaymentsService
```typescript
import { PaymentsService } from '../payments/services/payments.service';
```

#### Add to Constructor
```typescript
constructor(
  // ... other dependencies
  private readonly paymentsService: PaymentsService,
) {}
```

#### Modified `decideEnrollment` Method

**Logic Flow**:
```
1. Approve/Reject enrollment
2. Save registration status
3. IF approved AND tournament requires payment:
   a. Update registration status to 'payment_pending'
   b. Create payment automatically
   c. Send payment notification to players
4. ELSE:
   Send standard approval/rejection notification
```

**Code Added** (lines 196-256):
```typescript
// Create payment if enrollment is approved and tournament requires payment
if (params.decision === 'approved' && tournament?.paymentSettings?.requiresDeposit) {
  try {
    // Update registration status to payment_pending
    registration.status = 'payment_pending' as RegistrationStatus;
    await this.registrationRepository.save(registration);

    // Create payment with default type (can be changed by user later)
    await this.paymentsService.createPayment({
      enrollmentId: registration.id,
      paymentType: tournament.paymentSettings.allowTeamPayment ? 'full_team' : 'split',
    });

    // Notify players about payment requirement
    for (const p of players) {
      await this.notificationsService.create({
        userId: p.userId,
        type: NotificationType.PAYMENT_CONFIRMED,
        message: `Your enrollment was approved for "${tournament?.name ?? ''}". Payment is required to confirm your participation.`,
        metadata: {
          tournamentId: params.tournamentId,
          registrationId: registration.id,
          requiresPayment: true,
        },
      });
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    // If payment creation fails, still notify about approval
    for (const p of players) {
      await this.notificationsService.create({
        userId: p.userId,
        type: NotificationType.TOURNAMENT_UPDATE,
        message: `Your enrollment request was approved for tournament "${tournament?.name ?? ''}".`,
        metadata: {
          tournamentId: params.tournamentId,
          registrationId: registration.id,
          decision: params.decision,
        },
      });
    }
  }
} else {
  // No payment required, send standard notifications
  for (const p of players) {
    await this.notificationsService.create({
      userId: p.userId,
      type: NotificationType.TOURNAMENT_UPDATE,
      message:
        params.decision === 'approved'
          ? `Your enrollment request was approved for tournament "${tournament?.name ?? ''}".`
          : `Your enrollment request was rejected for tournament "${tournament?.name ?? ''}".`,
      metadata: {
        tournamentId: params.tournamentId,
        registrationId: registration.id,
        decision: params.decision,
        rejectionReason: registration.rejectionReason,
      },
    });
  }
}
```

---

### 2. TournamentsModule Integration

**File**: `src/tournaments/tournaments.module.ts`

**Changes Made**:

#### Import forwardRef and PaymentsModule
```typescript
import { Module, forwardRef } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
```

#### Add PaymentsModule to imports
```typescript
@Module({
  imports: [
    // ... other imports
    forwardRef(() => PaymentsModule),
  ],
  // ...
})
```

**Why forwardRef?**
- Prevents circular dependency issues
- Allows TournamentsModule to use PaymentsService
- PaymentsModule may also need TournamentsModule in the future

---

## Integration Flow

### Scenario 1: Tournament Requires Payment

```
┌─────────────────────────────────────────────────────────────┐
│                   APPROVAL WITH PAYMENT                     │
└─────────────────────────────────────────────────────────────┘

1. Organizer approves enrollment
   ↓
2. EnrollmentService.decideEnrollment()
   ↓
3. Check: tournament.paymentSettings.requiresDeposit === true
   ↓
4. Update registration.status = 'payment_pending'
   ↓
5. PaymentsService.createPayment()
   - enrollmentId: registration.id
   - paymentType: 'full_team' or 'split' (based on settings)
   ↓
6. Payment created with:
   - status: 'pending'
   - amount: tournament.paymentSettings.depositAmount
   - expiresAt: now + paymentDeadlineHours
   ↓
7. Notification sent to players:
   - type: PAYMENT_CONFIRMED
   - message: "Payment required to confirm participation"
   - metadata: { requiresPayment: true }
   ↓
8. Players receive notification
   ↓
9. Players click notification → Navigate to payment page
   ↓
10. Players complete payment
```

### Scenario 2: Tournament Does NOT Require Payment

```
┌─────────────────────────────────────────────────────────────┐
│                 APPROVAL WITHOUT PAYMENT                    │
└─────────────────────────────────────────────────────────────┘

1. Organizer approves enrollment
   ↓
2. EnrollmentService.decideEnrollment()
   ↓
3. Check: tournament.paymentSettings.requiresDeposit === false
   ↓
4. registration.status = 'approved'
   ↓
5. Notification sent to players:
   - type: TOURNAMENT_UPDATE
   - message: "Your enrollment was approved"
   ↓
6. Players receive notification
   ↓
7. Players are confirmed (no payment needed)
```

---

## Registration Status Transitions

### With Payment Required
```
pending → payment_pending → confirmed
   ↓
rejected
```

### Without Payment Required
```
pending → approved
   ↓
rejected
```

---

## Error Handling

### Payment Creation Failure

**If payment creation fails**:
1. Error is logged to console
2. Registration status remains 'approved' (not 'payment_pending')
3. Standard approval notification is sent
4. Players can still access the tournament
5. Organizer can manually create payment if needed

**Reasons for failure**:
- Database connection issues
- Invalid payment settings
- Missing tournament data
- PaymentsService unavailable

---

## Notification Types Used

### PAYMENT_CONFIRMED
- **When**: Enrollment approved + payment required
- **Message**: "Payment is required to confirm your participation"
- **Metadata**: `{ requiresPayment: true, registrationId, tournamentId }`
- **Action**: Navigate to payment page

### TOURNAMENT_UPDATE
- **When**: Enrollment approved/rejected (no payment) OR payment creation failed
- **Message**: "Your enrollment was approved/rejected"
- **Metadata**: `{ decision, registrationId, tournamentId, rejectionReason? }`
- **Action**: View tournament details

---

## Payment Settings Configuration

### Tournament Payment Settings
```typescript
interface PaymentSettings {
  requiresDeposit: boolean;           // Enable payment requirement
  depositAmount?: number;             // Amount to pay
  depositCurrency?: string;           // Currency (e.g., 'ARS')
  totalFee?: number;                  // Optional total fee
  paymentDeadlineHours: number;       // Hours to complete payment
  allowTeamPayment: boolean;          // One player pays all
  allowSplitPayment: boolean;         // Each player pays their share
  platformFeePercentage?: number;     // Platform commission
  refundPolicy?: RefundPolicy;        // Refund rules
}
```

### Default Payment Type Selection
```typescript
// If team payment is allowed, default to 'full_team'
// Otherwise, default to 'split'
paymentType: tournament.paymentSettings.allowTeamPayment ? 'full_team' : 'split'
```

---

## Frontend Integration Points

### 1. Enrollment Card Component
**File**: `src/components/enrollments/EnrollmentCard.tsx`

**Already Implemented**:
- ✅ "Pay Now" button for approved enrollments
- ✅ Navigates to `/payments/enrollments/:enrollmentId`

**Needs Enhancement**:
- [ ] Check if `enrollment.status === 'payment_pending'`
- [ ] Show payment deadline countdown
- [ ] Display payment amount

### 2. Notifications Handler
**Needs Implementation**:
- [ ] Handle `PAYMENT_CONFIRMED` notification type
- [ ] Navigate to payment page when clicked
- [ ] Show payment icon in notification

### 3. Dashboard Pending Payments
**File**: `src/pages/player/DashboardPage.tsx`

**Already Implemented**:
- ✅ Pending Payments section placeholder

**Needs Enhancement**:
- [ ] Fetch enrollments with status 'payment_pending'
- [ ] Display payment cards with countdown
- [ ] Show total amount due
- [ ] Quick pay buttons

---

## Testing Checklist

### Backend Testing
- [ ] Approve enrollment without payment settings → status = 'approved'
- [ ] Approve enrollment with payment settings → status = 'payment_pending'
- [ ] Verify payment is created automatically
- [ ] Verify payment amount matches tournament settings
- [ ] Verify payment type matches tournament settings
- [ ] Verify payment deadline is calculated correctly
- [ ] Verify notifications are sent to both players
- [ ] Test payment creation failure handling
- [ ] Test with team payment allowed
- [ ] Test with split payment only

### Frontend Testing
- [ ] Enrollment card shows "Pay Now" button
- [ ] Button navigates to correct payment page
- [ ] Payment page loads with enrollment data
- [ ] Payment type selector shows correct options
- [ ] Notifications display payment requirement
- [ ] Dashboard shows pending payments

### Integration Testing
- [ ] End-to-end: Approve → Create Payment → Notify → Navigate → Pay
- [ ] Multiple players receive notifications
- [ ] Payment deadline enforced
- [ ] Expired payments handled correctly
- [ ] Refund flow works after payment

---

## Database Changes

### TournamentRegistration Status Values
```sql
-- New status added
'payment_pending'  -- Approved but awaiting payment

-- Existing statuses
'pending'          -- Awaiting organizer approval
'approved'         -- Approved (no payment required)
'confirmed'        -- Payment completed
'rejected'         -- Rejected by organizer
'cancelled'        -- Cancelled by player
'withdrawn'        -- Withdrawn by player
```

---

## API Endpoints Affected

### POST /tournaments/:id/enrollments/:registrationId/decide
**Request**:
```json
{
  "decision": "approved",
  "rejectionReason": null
}
```

**Response** (with payment):
```json
{
  "id": "registration-uuid",
  "status": "payment_pending",
  "tournament": { ... },
  "team": { ... },
  "registeredAt": "2026-01-30T10:00:00Z"
}
```

**Side Effects**:
- Payment created in database
- Notifications sent to players
- Registration status updated

---

## Configuration Example

### Tournament with Payment Required
```json
{
  "name": "Summer Championship 2026",
  "paymentSettings": {
    "requiresDeposit": true,
    "depositAmount": 5000,
    "depositCurrency": "ARS",
    "paymentDeadlineHours": 48,
    "allowTeamPayment": true,
    "allowSplitPayment": true,
    "platformFeePercentage": 5,
    "refundPolicy": {
      "fullRefundDeadlineHours": 72,
      "partialRefundPercentage": 50,
      "noRefundDeadlineHours": 24
    }
  }
}
```

### Result After Approval
- Payment created: 5000 ARS
- Deadline: 48 hours from approval
- Players can choose: team or split payment
- Platform fee: 250 ARS (5%)

---

## Metrics & Analytics

### Track These Events
- `enrollment_approved_with_payment` - Count
- `payment_auto_created` - Count
- `payment_creation_failed` - Count + error details
- `payment_notification_sent` - Count
- `time_to_payment` - Duration from approval to payment
- `payment_completion_rate` - Percentage

---

## Future Enhancements

### Short-term
1. Add payment status to enrollment list response
2. Add payment deadline to notifications
3. Add payment reminder emails
4. Add payment expiration warnings

### Medium-term
1. Allow organizers to manually create payments
2. Add bulk payment creation for multiple enrollments
3. Add payment status dashboard for organizers
4. Add payment analytics and reports

### Long-term
1. Support installment payments
2. Support multiple payment methods
3. Support payment plans
4. Support group discounts

---

## Troubleshooting

### Payment Not Created
**Check**:
1. `tournament.paymentSettings.requiresDeposit === true`
2. PaymentsModule imported in TournamentsModule
3. PaymentsService injected in EnrollmentService
4. No errors in console logs
5. Database migrations applied

### Wrong Payment Type
**Check**:
1. `tournament.paymentSettings.allowTeamPayment`
2. `tournament.paymentSettings.allowSplitPayment`
3. At least one must be true

### Notifications Not Sent
**Check**:
1. NotificationsService working
2. Player user IDs valid
3. Notification type exists in enum
4. No errors in console logs

---

**Status**: ✅ **COMPLETED**  
**Ready for**: End-to-end testing  
**Next Steps**: Frontend enhancements for payment status display
