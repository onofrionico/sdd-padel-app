import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';
import { User } from '../users/entities/user.entity';
import { Season } from './entities/season.entity';

export interface RankingsResultItem {
  user: Pick<User, 'id' | 'firstName' | 'lastName'>;
  points: number;
  tournamentsCount: number;
}

export interface GetRankingsParams {
  associationId: string;
  seasonId?: string;
  category?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentPlayer)
    private readonly playerRepository: Repository<TournamentPlayer>,
  ) {}

  async getRankings(params: GetRankingsParams): Promise<{ items: RankingsResultItem[]; count: number; page: number; pageSize: number; season: Season }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const season = params.seasonId
      ? await this.seasonRepository.findOne({ where: { id: params.seasonId, associationId: params.associationId } })
      : await this.getCurrentSeason(params.associationId);

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    const tournaments = await this.tournamentRepository.find({
      where: {
        associationId: params.associationId,
        startDate: Between(season.startDate, season.endDate),
      },
      select: ['id'],
    });

    const tournamentIds = tournaments.map(t => t.id);

    if (tournamentIds.length === 0) {
      return { items: [], count: 0, page, pageSize: limit, season };
    }

    const qb = this.playerRepository
      .createQueryBuilder('tp')
      .innerJoin('tp.team', 'team')
      .innerJoin(User, 'u', 'u.id = tp.userId')
      .where('team.tournamentId IN (:...tournamentIds)', { tournamentIds })
      .select('tp.userId', 'userId')
      .addSelect('u.firstName', 'firstName')
      .addSelect('u.lastName', 'lastName')
      .addSelect('SUM(team.points)', 'points')
      .addSelect('COUNT(DISTINCT team.tournamentId)', 'tournamentsCount')
      .groupBy('tp.userId')
      .addGroupBy('u.firstName')
      .addGroupBy('u.lastName')
      .orderBy('SUM(team.points)', 'DESC')
      .addOrderBy('u.lastName', 'ASC')
      .addOrderBy('u.firstName', 'ASC');

    if (typeof params.category === 'number') {
      qb.andWhere('tp.category = :category', { category: params.category });
    }

    const allRows = await qb.getRawMany<{
      userId: string;
      firstName: string;
      lastName: string;
      points: string;
      tournamentsCount: string;
    }>();

    const count = allRows.length;
    const startIndex = (page - 1) * limit;
    const pageRows = allRows.slice(startIndex, startIndex + limit);

    const items: RankingsResultItem[] = pageRows.map(r => ({
      user: { id: r.userId, firstName: r.firstName, lastName: r.lastName },
      points: Number(r.points ?? 0),
      tournamentsCount: Number(r.tournamentsCount ?? 0),
    }));

    return { items, count, page, pageSize: limit, season };
  }

  async getCurrentSeason(associationId: string, at: Date = new Date()): Promise<Season> {
    const seasons = await this.seasonRepository.find({
      where: { associationId },
      order: { startDate: 'DESC' },
    });

    const match = seasons.find(s => {
      const t = at.getTime();
      return t >= new Date(s.startDate).getTime() && t <= new Date(s.endDate).getTime();
    });

    if (!match) {
      throw new NotFoundException('Current season not found');
    }

    return match;
  }
}
