import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from '../services/payments.service';

@Injectable()
export class PaymentExpirationJob {
  private readonly logger = new Logger(PaymentExpirationJob.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkExpiredPayments(): Promise<void> {
    this.logger.log('Checking for expired payments...');
    
    try {
      await this.paymentsService.checkExpiredPayments();
      this.logger.log('Expired payments check completed');
    } catch (error) {
      this.logger.error('Error checking expired payments', error);
    }
  }
}
