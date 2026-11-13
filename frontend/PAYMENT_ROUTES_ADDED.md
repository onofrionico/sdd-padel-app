# Payment Routes Added to Router

**Date**: January 29, 2026  
**Status**: ✅ Completed

---

## Routes Added

### 1. Player Payment Route

**Path**: `/payments/enrollments/:enrollmentId`  
**Component**: `PaymentPage`  
**Protection**: `ProtectedRoute` (requires authentication)  
**Purpose**: Allow players to view and create payments for their enrollments

**Usage Example**:
```tsx
// Navigate to payment page for an enrollment
navigate(`/payments/enrollments/${enrollmentId}`);
```

**Features**:
- View existing payment status
- Create new payment with type selection (team/split)
- Display payment card with countdown timer
- "Pay Now" button to redirect to payment gateway
- Back navigation

---

### 2. Tournament Payments Dashboard Route

**Path**: `/organizer/tournaments/:id/payments`  
**Component**: `TournamentPaymentsPage`  
**Protection**: `OrganizerRoute` (requires organizer role)  
**Purpose**: Allow tournament organizers to view all payments for their tournament

**Usage Example**:
```tsx
// Navigate to tournament payments dashboard
navigate(`/organizer/tournaments/${tournamentId}/payments`);
```

**Features**:
- View payment statistics (revenue, completed, pending)
- Filter payments by status (all, pending, completed, failed, refunded)
- List all tournament payments with details
- Export capabilities (future)
- Real-time stats calculation

---

## Router Configuration

**File**: `src/routes/index.tsx`

### Changes Made

1. **Added lazy imports** (lines 26-27):
```tsx
const PaymentPage = lazy(() => import('@/pages/payments/PaymentPage').then(m => ({ default: m.PaymentPage })))
const TournamentPaymentsPage = lazy(() => import('@/pages/payments/TournamentPaymentsPage').then(m => ({ default: m.TournamentPaymentsPage })))
```

2. **Added player payment route** (lines 128-136):
```tsx
{/* Payment routes */}
<Route
  path="/payments/enrollments/:enrollmentId"
  element={
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  }
/>
```

3. **Added organizer payment route** (lines 179-186):
```tsx
<Route
  path="/organizer/tournaments/:id/payments"
  element={
    <OrganizerRoute>
      <TournamentPaymentsPage />
    </OrganizerRoute>
  }
/>
```

---

## Route Protection

### ProtectedRoute
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Used for player-facing payment page

### OrganizerRoute
- Checks if user is authenticated AND has organizer role
- Redirects to `/dashboard` if not an organizer
- Used for tournament payments dashboard

---

## Integration Points

### From Enrollment Approval
When an enrollment is approved and requires payment:
```tsx
// In enrollment approval handler
if (tournament.paymentSettings?.requiresDeposit) {
  navigate(`/payments/enrollments/${enrollment.id}`);
}
```

### From Tournament Management
Add link to payments dashboard in tournament management:
```tsx
// In ManageTournamentPage or similar
<Button onClick={() => navigate(`/organizer/tournaments/${tournamentId}/payments`)}>
  View Payments
</Button>
```

### From User Dashboard
Show pending payments with links:
```tsx
// In DashboardPage
{pendingPayments.map(payment => (
  <PaymentCard 
    payment={payment}
    onPaymentClick={() => navigate(`/payments/enrollments/${payment.enrollmentId}`)}
  />
))}
```

### From Notifications
Payment reminder notifications can link directly:
```tsx
// In notification handler
if (notification.type === 'PAYMENT_DEADLINE_REMINDER') {
  navigate(`/payments/enrollments/${notification.metadata.enrollmentId}`);
}
```

---

## URL Parameters

### PaymentPage
- `:enrollmentId` - UUID of the tournament enrollment

**Example**: `/payments/enrollments/123e4567-e89b-12d3-a456-426614174000`

### TournamentPaymentsPage
- `:id` - UUID of the tournament (matches existing pattern)

**Example**: `/organizer/tournaments/123e4567-e89b-12d3-a456-426614174000/payments`

---

## Navigation Examples

### Player Flow
```tsx
// 1. Player receives enrollment approval notification
// 2. Clicks notification or "Pay Now" button
navigate(`/payments/enrollments/${enrollmentId}`);

// 3. Selects payment type (team/split)
// 4. Clicks "Pay Now" - redirected to payment gateway
// 5. Returns to app after payment
// 6. Payment status updates automatically
```

### Organizer Flow
```tsx
// 1. Organizer goes to tournament management
navigate(`/organizer/tournaments/${tournamentId}`);

// 2. Clicks "View Payments" tab/button
navigate(`/organizer/tournaments/${tournamentId}/payments`);

// 3. Views dashboard with stats and payment list
// 4. Can filter by status, initiate refunds, etc.
```

---

## Testing Routes

### Manual Testing
```bash
# Start dev server
npm run dev

# Test player route (replace with actual enrollment ID)
http://localhost:5173/payments/enrollments/test-enrollment-id

# Test organizer route (replace with actual tournament ID)
http://localhost:5173/organizer/tournaments/test-tournament-id/payments
```

### Route Guards Testing
1. **Unauthenticated user** → Should redirect to `/login`
2. **Authenticated player** → Can access `/payments/enrollments/:id`
3. **Non-organizer** → Cannot access `/organizer/tournaments/:id/payments`
4. **Organizer** → Can access both routes

---

## Next Steps

### Immediate
1. ✅ Routes added to router
2. ⏳ Add navigation links in UI
3. ⏳ Test with real enrollment IDs
4. ⏳ Test route protection

### Integration
1. Add "Pay Now" button in enrollment approval flow
2. Add "Payments" tab in tournament management page
3. Add pending payments section in user dashboard
4. Link payment notifications to payment page

### Enhancement
1. Add breadcrumbs for better navigation
2. Add "Back to Tournament" link in payment pages
3. Add payment history page for players
4. Add payment export feature for organizers

---

## Route Structure Overview

```
/
├── /login (public)
├── /register (public)
├── /dashboard (protected)
├── /tournaments (protected)
│   └── /:id (protected)
├── /enrollments (protected)
├── /payments (protected) ← NEW
│   └── /enrollments/:enrollmentId ← NEW
├── /organizer (organizer only)
│   ├── /dashboard
│   └── /tournaments
│       └── /:id
│           ├── /edit
│           ├── /enrollments
│           └── /payments ← NEW
└── * (404)
```

---

## Compilation Status

✅ Routes successfully added to router  
✅ Lazy loading configured  
✅ Route protection applied  
⚠️ Existing test errors (unrelated to payment routes)

**Note**: The compilation errors are from existing tournament filter tests that need the `onAssociationChange` prop. These are not related to the payment routes and should be fixed separately.

---

## Summary

- **2 new routes** added successfully
- **Lazy loading** implemented for code splitting
- **Route protection** configured appropriately
- **Ready for integration** with enrollment and tournament flows
- **Documentation** complete with examples

The payment system is now fully accessible via the application router! 🎉
