import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from '../entities/payment.entity';
import { PaymentEvent, PaymentEventType } from '../entities/payment-event.entity';
import { TournamentRegistration } from '../../tournaments/entities/tournament-registration.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly DEFAULT_PLATFORM_FEE_PERCENTAGE = 5.0;
  private readonly DEFAULT_PAYMENT_DEADLINE_HOURS = 48;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentEvent)
    private readonly paymentEventRepository: Repository<PaymentEvent>,
    @InjectRepository(TournamentRegistration)
    private readonly registrationRepository: Repository<TournamentRegistration>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async createPaymentForEnrollment(
    enrollmentId: string,
    payerId: string,
    paymentType: PaymentType = 'full_team',
  ): Promise<Payment> {
    const enrollment = await this.registrationRepository.findOne({
      where: { id: enrollmentId },
      relations: ['tournament', 'team', 'team.players'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const tournament = enrollment.tournament;
    const paymentSettings = tournament.paymentSettings;

    if (!paymentSettings?.requiresDeposit) {
      throw new BadRequestException('This tournament does not require payment');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentRepository.findOne({
      where: { enrollmentId, status: 'pending' },
    });

    if (existingPayment) {
      return existingPayment;
    }

    // Calculate amounts
    const baseAmount = paymentSettings.depositAmount || paymentSettings.totalFee || 0;
    const amount = paymentType === 'split' ? baseAmount / 2 : baseAmount;
    const platformFeePercentage = paymentSettings.platformFeePercentage || this.DEFAULT_PLATFORM_FEE_PERCENTAGE;
    const platformFee = (amount * platformFeePercentage) / 100;
    const gatewayFee = 0; // Will be updated after payment gateway response
    const netAmount = amount - platformFee - gatewayFee;

    // Calculate expiration
    const deadlineHours = paymentSettings.paymentDeadlineHours || this.DEFAULT_PAYMENT_DEADLINE_HOURS;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + deadlineHours);

    // Create payment
    const payment = this.paymentRepository.create({
      enrollmentId,
      amount,
      platformFee,
      gatewayFee,
      netAmount,
      currency: paymentSettings.depositCurrency || 'ARS',
      status: 'pending',
      paymentType,
      paidBy: payerId,
      paymentGateway: 'mercadopago',
      expiresAt,
      metadata: {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        teamSize: enrollment.team?.players?.length || 2,
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Create payment event
    await this.createPaymentEvent(savedPayment.id, 'created', {
      paymentType,
      amount,
      expiresAt,
    });

    this.logger.log(`Payment created for enrollment ${enrollmentId}: ${savedPayment.id}`);

    return savedPayment;
  }

  async getPaymentById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['enrollment', 'enrollment.team', 'enrollment.team.players', 'payer'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentByEnrollment(enrollmentId: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { enrollmentId },
      relations: ['enrollment', 'payer'],
      order: { createdAt: 'DESC' },
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    metadata?: Record<string, any>,
  ): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId);

    payment.status = status;
    if (status === 'completed') {
      payment.paidAt = new Date();
    }

    if (metadata) {
      payment.metadata = { ...payment.metadata, ...metadata };
    }

    const updatedPayment = await this.paymentRepository.save(payment);

    // Create event
    await this.createPaymentEvent(paymentId, status as PaymentEventType, metadata);

    this.logger.log(`Payment ${paymentId} status updated to ${status}`);

    return updatedPayment;
  }

  async processPaymentWebhook(webhookData: any): Promise<void> {
    // This will be implemented with Mercado Pago integration
    // For now, just log the webhook
    this.logger.log('Payment webhook received', webhookData);
  }

  async checkExpiredPayments(): Promise<void> {
    const expiredPayments = await this.paymentRepository.find({
      where: {
        status: 'pending',
        expiresAt: LessThan(new Date()),
      },
      relations: ['enrollment'],
    });

    this.logger.log(`Found ${expiredPayments.length} expired payments`);

    for (const payment of expiredPayments) {
      await this.cancelExpiredPayment(payment.id);
    }
  }

  async cancelExpiredPayment(paymentId: string): Promise<void> {
    const payment = await this.getPaymentById(paymentId);

    if (payment.status !== 'pending') {
      return;
    }

    payment.status = 'failed';
    await this.paymentRepository.save(payment);

    // Update enrollment status to cancelled
    const enrollment = await this.registrationRepository.findOne({
      where: { id: payment.enrollmentId },
    });

    if (enrollment && enrollment.status === 'payment_pending') {
      enrollment.status = 'cancelled';
      await this.registrationRepository.save(enrollment);
    }

    await this.createPaymentEvent(paymentId, 'expired', {
      reason: 'Payment deadline expired',
    });

    this.logger.log(`Payment ${paymentId} cancelled due to expiration`);
  }

  async getPaymentsNearingExpiration(hoursBeforeExpiration: number): Promise<Payment[]> {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + hoursBeforeExpiration);

    const lowerBound = new Date(targetTime);
    lowerBound.setMinutes(lowerBound.getMinutes() - 30); // 30 min window

    const upperBound = new Date(targetTime);
    upperBound.setMinutes(upperBound.getMinutes() + 30);

    return this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.status = :status', { status: 'pending' })
      .andWhere('payment.expiresAt BETWEEN :lowerBound AND :upperBound', {
        lowerBound,
        upperBound,
      })
      .leftJoinAndSelect('payment.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.team', 'team')
      .leftJoinAndSelect('team.players', 'players')
      .getMany();
  }

  private async createPaymentEvent(
    paymentId: string,
    eventType: PaymentEventType,
    eventData: Record<string, any> = {},
  ): Promise<PaymentEvent> {
    const event = this.paymentEventRepository.create({
      paymentId,
      eventType,
      eventData,
    });

    return this.paymentEventRepository.save(event);
  }

  async getTournamentPayments(tournamentId: string): Promise<Payment[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.team', 'team')
      .leftJoinAndSelect('team.players', 'players')
      .leftJoinAndSelect('players.user', 'user')
      .leftJoinAndSelect('payment.payer', 'payer')
      .where('enrollment.tournamentId = :tournamentId', { tournamentId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  async calculatePlatformFee(amount: number, feePercentage?: number): Promise<number> {
    const percentage = feePercentage || this.DEFAULT_PLATFORM_FEE_PERCENTAGE;
    return (amount * percentage) / 100;
  }
}
