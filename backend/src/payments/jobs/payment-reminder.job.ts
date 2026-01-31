import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from '../services/payments.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/entities/notification.entity';

@Injectable()
export class PaymentReminderJob {
  private readonly logger = new Logger(PaymentReminderJob.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendPaymentReminders(): Promise<void> {
    this.logger.log('Checking for payments needing reminders...');

    try {
      // Check for payments expiring in 24h, 12h, and 2h
      await this.sendRemindersForDeadline(24, 'PAYMENT_DEADLINE_REMINDER_24H');
      await this.sendRemindersForDeadline(12, 'PAYMENT_DEADLINE_REMINDER_12H');
      await this.sendRemindersForDeadline(2, 'PAYMENT_DEADLINE_REMINDER_2H');

      this.logger.log('Payment reminders check completed');
    } catch (error) {
      this.logger.error('Error sending payment reminders', error);
    }
  }

  private async sendRemindersForDeadline(
    hours: number,
    notificationType: string,
  ): Promise<void> {
    const payments = await this.paymentsService.getPaymentsNearingExpiration(hours);

    this.logger.log(`Found ${payments.length} payments expiring in ~${hours}h`);

    for (const payment of payments) {
      const enrollment = payment.enrollment;
      if (!enrollment?.team?.players) continue;

      const tournamentName = payment.metadata?.tournamentName || 'Tournament';
      const timeLeft = hours === 24 ? '24 hours' : hours === 12 ? '12 hours' : '2 hours';

      for (const player of enrollment.team.players) {
        try {
          await this.notificationsService.create({
            userId: player.userId,
            type: notificationType as NotificationType,
            message: `Payment reminder: Your payment for "${tournamentName}" is due in ${timeLeft}. Please complete payment to confirm your enrollment.`,
            metadata: {
              paymentId: payment.id,
              enrollmentId: enrollment.id,
              tournamentId: payment.metadata?.tournamentId,
              expiresAt: payment.expiresAt,
              amount: payment.amount,
              paymentUrl: payment.paymentUrl,
            },
          });
        } catch (error) {
          this.logger.error(
            `Failed to send reminder to user ${player.userId}`,
            error,
          );
        }
      }
    }
  }
}
