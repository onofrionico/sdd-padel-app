export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentType = 'full_team' | 'split' | 'deposit' | 'full_fee';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  platformFee: number;
  gatewayFee: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  paidBy: string;
  paymentMethod?: string;
  paymentGateway: string;
  externalTransactionId?: string;
  paymentUrl?: string;
  paidAt?: string;
  expiresAt: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  enrollment?: any;
  payer?: any;
}

export interface PaymentEvent {
  id: string;
  paymentId: string;
  eventType: string;
  eventData: Record<string, any>;
  createdAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  status: RefundStatus;
  externalRefundId?: string;
  initiatedBy: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
  initiator?: any;
}

export interface PaymentSettings {
  requiresDeposit: boolean;
  depositAmount?: number;
  depositCurrency?: string;
  totalFee?: number;
  paymentDeadlineHours?: number;
  allowTeamPayment?: boolean;
  allowSplitPayment?: boolean;
  platformFeePercentage?: number;
  refundPolicy?: RefundPolicy;
}

export interface RefundPolicy {
  fullRefundDeadlineHours?: number;
  partialRefundPercentage?: number;
  noRefundDeadlineHours?: number;
  refundPlatformFee?: boolean;
}

export interface CreatePaymentRequest {
  enrollmentId: string;
  paymentType: PaymentType;
}

export interface CreateRefundRequest {
  amount: number;
  reason?: string;
}

export interface PaymentDashboardStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  platformFees: number;
  gatewayFees: number;
  netRevenue: number;
  teamPaymentCount: number;
  splitPaymentCount: number;
  averagePaymentAmount: number;
}

export interface PaymentListItem extends Payment {
  playerName?: string;
  partnerName?: string;
  tournamentName?: string;
  timeRemaining?: number;
}
