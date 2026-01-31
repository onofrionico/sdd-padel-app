import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { Refund } from './entities/refund.entity';
import { PaymentsService } from './services/payments.service';
import { RefundsService } from './services/refunds.service';
import { PaymentsController } from './payments.controller';
import { PaymentExpirationJob } from './jobs/payment-expiration.job';
import { PaymentReminderJob } from './jobs/payment-reminder.job';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TournamentRegistration } from '../tournaments/entities/tournament-registration.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentEvent, Refund, TournamentRegistration, Tournament]),
    ScheduleModule.forRoot(),
    forwardRef(() => TournamentsModule),
    NotificationsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService, 
    RefundsService,
    PaymentExpirationJob,
    PaymentReminderJob,
  ],
  exports: [PaymentsService, RefundsService],
})
export class PaymentsModule {}
