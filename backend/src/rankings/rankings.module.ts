import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from '../associations/entities/association.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';
import { TournamentTeam } from '../tournaments/entities/tournament-team.entity';
import { User } from '../users/entities/user.entity';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { Season } from './entities/season.entity';
import { SeasonsService } from './seasons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Season, Association, Tournament, TournamentTeam, TournamentPlayer, User])],
  controllers: [RankingsController],
  providers: [SeasonsService, RankingsService],
  exports: [SeasonsService, RankingsService],
})
export class RankingsModule {}
