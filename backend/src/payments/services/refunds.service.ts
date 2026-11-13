import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund, RefundStatus } from '../entities/refund.entity';
import { Payment } from '../entities/payment.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async initiateRefund(
    paymentId: string,
    amount: number,
    reason: string,
    initiatedBy: string,
  ): Promise<Refund> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['enrollment', 'enrollment.tournament'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new BadRequestException('Can only refund completed payments');
    }

    // Validate refund amount
    const totalRefunded = await this.getTotalRefundedAmount(paymentId);
    const maxRefundable = payment.amount - totalRefunded;

    if (amount > maxRefundable) {
      throw new BadRequestException(
        `Refund amount exceeds maximum refundable amount of ${maxRefundable}`,
      );
    }

    // Create refund
    const refund = this.refundRepository.create({
      paymentId,
      amount,
      reason,
      status: 'pending',
      initiatedBy,
    });

    const savedRefund = await this.refundRepository.save(refund);

    this.logger.log(`Refund initiated for payment ${paymentId}: ${savedRefund.id}`);

    // Update payment status
    if (amount === payment.amount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }
    await this.paymentRepository.save(payment);

    return savedRefund;
  }

  async processRefund(refundId: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId },
      relations: ['payment'],
    });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    if (refund.status !== 'pending') {
      throw new BadRequestException('Refund is not pending');
    }

    // TODO: Process refund through payment gateway
    // For now, mark as completed
    refund.status = 'completed';
    refund.processedAt = new Date();
    refund.externalRefundId = `REFUND_${Date.now()}`; // Placeholder

    const updatedRefund = await this.refundRepository.save(refund);

    this.logger.log(`Refund processed: ${refundId}`);

    return updatedRefund;
  }

  async calculateRefundAmount(
    payment: Payment,
    tournament: Tournament,
  ): Promise<number> {
    const paymentSettings = tournament.paymentSettings;
    const refundPolicy = paymentSettings?.refundPolicy;

    if (!refundPolicy) {
      return payment.amount; // Full refund if no policy
    }

    const now = new Date();
    const tournamentStart = new Date(tournament.startDate);
    const hoursUntilStart = (tournamentStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Full refund
    if (
      refundPolicy.fullRefundDeadlineHours &&
      hoursUntilStart >= refundPolicy.fullRefundDeadlineHours
    ) {
      const baseRefund = payment.amount;
      // Check if platform fee should be refunded
      if (!refundPolicy.refundPlatformFee) {
        return baseRefund - payment.platformFee;
      }
      return baseRefund;
    }

    // Partial refund
    if (
      refundPolicy.partialRefundPercentage &&
      refundPolicy.noRefundDeadlineHours &&
      hoursUntilStart >= refundPolicy.noRefundDeadlineHours
    ) {
      const baseRefund = (payment.amount * refundPolicy.partialRefundPercentage) / 100;
      if (!refundPolicy.refundPlatformFee) {
        return Math.max(0, baseRefund - payment.platformFee);
      }
      return baseRefund;
    }

    // No refund
    return 0;
  }

  async getRefundsByPayment(paymentId: string): Promise<Refund[]> {
    return this.refundRepository.find({
      where: { paymentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTotalRefundedAmount(paymentId: string): Promise<number> {
    const refunds = await this.refundRepository.find({
      where: { paymentId, status: 'completed' },
    });

    return refunds.reduce((total, refund) => total + Number(refund.amount), 0);
  }

  async getRefundById(refundId: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId },
      relations: ['payment', 'initiator'],
    });

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    return refund;
  }
}
