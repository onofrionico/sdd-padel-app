import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { Association } from '../associations/entities/association.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { TournamentPlayer } from './entities/tournament-player.entity';
import { TournamentRegistration } from './entities/tournament-registration.entity';
import { TournamentMatch } from './entities/tournament-match.entity';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { AssociationsModule } from '../associations/associations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TournamentMatchesController } from './tournament-matches.controller';
import { TournamentMatchesService } from './tournament-matches.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      Association,
      TournamentTeam,
      TournamentPlayer,
      TournamentRegistration,
      TournamentMatch,
    ]),
    AssociationsModule,
    NotificationsModule,
  ],
  controllers: [TournamentController, EnrollmentController, TournamentMatchesController],
  providers: [TournamentService, EnrollmentService, TournamentMatchesService],
  exports: [TournamentService],
})
export class TournamentsModule {}
