import { apiClient } from './api/client';
import {
  Payment,
  Refund,
  CreatePaymentRequest,
  CreateRefundRequest,
  PaymentDashboardStats,
} from '../types/payment.types';

class PaymentsService {
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post(
      `/payments/enrollments/${data.enrollmentId}`,
      { paymentType: data.paymentType }
    );
    return response.data;
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    const response = await apiClient.get(
      `/payments/${paymentId}`
    );
    return response.data;
  }

  async getPaymentByEnrollment(enrollmentId: string): Promise<Payment | null> {
    try {
      const response = await apiClient.get(
        `/payments/enrollments/${enrollmentId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async initiateRefund(
    paymentId: string,
    data: CreateRefundRequest
  ): Promise<Refund> {
    const response = await apiClient.post(
      `/payments/${paymentId}/refund`,
      data
    );
    return response.data;
  }

  async processRefund(refundId: string): Promise<Refund> {
    const response = await apiClient.post(
      `/payments/refunds/${refundId}/process`,
      {}
    );
    return response.data;
  }

  async getRefundsByPayment(paymentId: string): Promise<Refund[]> {
    const response = await apiClient.get(
      `/payments/${paymentId}/refunds`
    );
    return response.data;
  }

  async getTournamentPayments(tournamentId: string): Promise<Payment[]> {
    const response = await apiClient.get(
      `/tournaments/${tournamentId}/payments`
    );
    return response.data;
  }

  calculatePaymentStats(payments: Payment[]): PaymentDashboardStats {
    const completed = payments.filter((p) => p.status === 'completed');
    const pending = payments.filter((p) => p.status === 'pending');
    const failed = payments.filter((p) => p.status === 'failed');
    const teamPayments = payments.filter((p) => p.paymentType === 'full_team');
    const splitPayments = payments.filter((p) => p.paymentType === 'split');

    const totalRevenue = completed.reduce((sum, p) => sum + Number(p.amount), 0);
    const platformFees = completed.reduce((sum, p) => sum + Number(p.platformFee), 0);
    const gatewayFees = completed.reduce((sum, p) => sum + Number(p.gatewayFee), 0);
    const netRevenue = completed.reduce((sum, p) => sum + Number(p.netAmount), 0);

    return {
      totalPayments: payments.length,
      completedPayments: completed.length,
      pendingPayments: pending.length,
      failedPayments: failed.length,
      totalRevenue,
      platformFees,
      gatewayFees,
      netRevenue,
      teamPaymentCount: teamPayments.length,
      splitPaymentCount: splitPayments.length,
      averagePaymentAmount: completed.length > 0 ? totalRevenue / completed.length : 0,
    };
  }

  getTimeRemaining(expiresAt: string): number {
    const now = new Date().getTime();
    const expiration = new Date(expiresAt).getTime();
    return Math.max(0, expiration - now);
  }

  formatTimeRemaining(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  isPaymentExpired(expiresAt: string): boolean {
    return new Date(expiresAt).getTime() < new Date().getTime();
  }

  canRefund(payment: Payment): boolean {
    return payment.status === 'completed';
  }
}

export const paymentsService = new PaymentsService();
export default paymentsService;
