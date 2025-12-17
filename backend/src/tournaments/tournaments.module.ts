import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { Association } from '../associations/entities/association.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament, Association]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentsModule {}
