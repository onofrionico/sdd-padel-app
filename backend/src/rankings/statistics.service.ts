import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Tournament, TournamentStatus } from '../tournaments/entities/tournament.entity';
import { TournamentMatch } from '../tournaments/entities/tournament-match.entity';
import { TournamentTeam } from '../tournaments/entities/tournament-team.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';
import { User } from '../users/entities/user.entity';
import { Season } from './entities/season.entity';
import { RankingsService } from './rankings.service';

export interface TournamentStatistics {
  totalTournaments: number;
  completedTournaments: number;
  inProgressTournaments: number;
  upcomingTournaments: number;
  totalMatches: number;
  completedMatches: number;
  totalTeams: number;
  totalPlayers: number;
  averageTeamsPerTournament: number;
  averageMatchesPerTournament: number;
}

export interface PlayerStatistics {
  userId: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName'>;
  totalTournaments: number;
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  winRate: number;
  totalPoints: number;
  averagePointsPerTournament: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  currentRanking?: number;
  bestRanking?: number;
}

export interface CategoryStatistics {
  category: number;
  totalPlayers: number;
  totalTournaments: number;
  averagePointsPerPlayer: number;
  topPlayer?: {
    userId: string;
    firstName: string;
    lastName: string;
    points: number;
  };
}

export interface GetStatisticsParams {
  associationId: string;
  seasonId?: string;
  category?: number;
  userId?: string;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentMatch)
    private readonly matchRepository: Repository<TournamentMatch>,
    @InjectRepository(TournamentTeam)
    private readonly teamRepository: Repository<TournamentTeam>,
    @InjectRepository(TournamentPlayer)
    private readonly playerRepository: Repository<TournamentPlayer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rankingsService: RankingsService,
  ) {}

  async getTournamentStatistics(params: GetStatisticsParams): Promise<TournamentStatistics> {
    const season = params.seasonId
      ? await this.seasonRepository.findOne({ where: { id: params.seasonId, associationId: params.associationId } })
      : await this.rankingsService.getCurrentSeason(params.associationId);

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    const tournaments = await this.tournamentRepository.find({
      where: {
        associationId: params.associationId,
        startDate: Between(season.startDate, season.endDate),
      },
      relations: ['teams', 'matches'],
    });

    const totalTournaments = tournaments.length;
    const completedTournaments = tournaments.filter(t => t.status === TournamentStatus.COMPLETED).length;
    const inProgressTournaments = tournaments.filter(t => t.status === TournamentStatus.IN_PROGRESS).length;
    const upcomingTournaments = tournaments.filter(
      t => t.status === TournamentStatus.UPCOMING || t.status === TournamentStatus.REGISTRATION_OPEN
    ).length;

    const tournamentIds = tournaments.map(t => t.id);
    
    let totalMatches = 0;
    let completedMatches = 0;
    let totalTeams = 0;

    if (tournamentIds.length > 0) {
      const matchStats = await this.matchRepository
        .createQueryBuilder('m')
        .where('m.tournamentId IN (:...tournamentIds)', { tournamentIds })
        .select('COUNT(*)', 'total')
        .addSelect('SUM(CASE WHEN m.status = :completed THEN 1 ELSE 0 END)', 'completed')
        .setParameter('completed', 'completed')
        .getRawOne();

      totalMatches = Number(matchStats?.total ?? 0);
      completedMatches = Number(matchStats?.completed ?? 0);

      const teamStats = await this.teamRepository
        .createQueryBuilder('t')
        .where('t.tournamentId IN (:...tournamentIds)', { tournamentIds })
        .select('COUNT(DISTINCT t.id)', 'total')
        .getRawOne();

      totalTeams = Number(teamStats?.total ?? 0);
    }

    const playerStats = await this.playerRepository
      .createQueryBuilder('tp')
      .innerJoin('tp.team', 'team')
      .where('team.tournamentId IN (:...tournamentIds)', { tournamentIds })
      .select('COUNT(DISTINCT tp.userId)', 'total')
      .getRawOne();

    const totalPlayers = Number(playerStats?.total ?? 0);

    return {
      totalTournaments,
      completedTournaments,
      inProgressTournaments,
      upcomingTournaments,
      totalMatches,
      completedMatches,
      totalTeams,
      totalPlayers,
      averageTeamsPerTournament: totalTournaments > 0 ? totalTeams / totalTournaments : 0,
      averageMatchesPerTournament: totalTournaments > 0 ? totalMatches / totalTournaments : 0,
    };
  }

  async getPlayerStatistics(params: GetStatisticsParams): Promise<PlayerStatistics> {
    if (!params.userId) {
      throw new NotFoundException('User ID is required for player statistics');
    }

    const season = params.seasonId
      ? await this.seasonRepository.findOne({ where: { id: params.seasonId, associationId: params.associationId } })
      : await this.rankingsService.getCurrentSeason(params.associationId);

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    const user = await this.userRepository.findOne({ where: { id: params.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
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
      return this.createEmptyPlayerStatistics(params.userId, user);
    }

    const playerTeams = await this.playerRepository
      .createQueryBuilder('tp')
      .innerJoin('tp.team', 'team')
      .where('tp.userId = :userId', { userId: params.userId })
      .andWhere('team.tournamentId IN (:...tournamentIds)', { tournamentIds })
      .select('team.id', 'teamId')
      .addSelect('team.points', 'points')
      .addSelect('team.matchesWon', 'matchesWon')
      .addSelect('team.matchesLost', 'matchesLost')
      .addSelect('team.setsWon', 'setsWon')
      .addSelect('team.setsLost', 'setsLost')
      .addSelect('team.gamesWon', 'gamesWon')
      .addSelect('team.gamesLost', 'gamesLost')
      .getRawMany();

    const totalTournaments = playerTeams.length;
    const totalPoints = playerTeams.reduce((sum, t) => sum + Number(t.points ?? 0), 0);
    const matchesWon = playerTeams.reduce((sum, t) => sum + Number(t.matchesWon ?? 0), 0);
    const matchesLost = playerTeams.reduce((sum, t) => sum + Number(t.matchesLost ?? 0), 0);
    const setsWon = playerTeams.reduce((sum, t) => sum + Number(t.setsWon ?? 0), 0);
    const setsLost = playerTeams.reduce((sum, t) => sum + Number(t.setsLost ?? 0), 0);
    const gamesWon = playerTeams.reduce((sum, t) => sum + Number(t.gamesWon ?? 0), 0);
    const gamesLost = playerTeams.reduce((sum, t) => sum + Number(t.gamesLost ?? 0), 0);

    const totalMatches = matchesWon + matchesLost;
    const winRate = totalMatches > 0 ? (matchesWon / totalMatches) * 100 : 0;

    const rankings = await this.rankingsService.getRankings({
      associationId: params.associationId,
      seasonId: season.id,
      category: params.category,
    });

    const currentRanking = rankings.items.findIndex(r => r.user.id === params.userId) + 1;

    return {
      userId: params.userId,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
      totalTournaments,
      totalMatches,
      matchesWon,
      matchesLost,
      winRate: Math.round(winRate * 100) / 100,
      totalPoints,
      averagePointsPerTournament: totalTournaments > 0 ? Math.round((totalPoints / totalTournaments) * 100) / 100 : 0,
      setsWon,
      setsLost,
      gamesWon,
      gamesLost,
      currentRanking: currentRanking > 0 ? currentRanking : undefined,
    };
  }

  async getCategoryStatistics(params: GetStatisticsParams): Promise<CategoryStatistics[]> {
    const season = params.seasonId
      ? await this.seasonRepository.findOne({ where: { id: params.seasonId, associationId: params.associationId } })
      : await this.rankingsService.getCurrentSeason(params.associationId);

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
      return [];
    }

    const categoryStats = await this.playerRepository
      .createQueryBuilder('tp')
      .innerJoin('tp.team', 'team')
      .innerJoin(User, 'u', 'u.id = tp.userId')
      .where('team.tournamentId IN (:...tournamentIds)', { tournamentIds })
      .andWhere('tp.category IS NOT NULL')
      .select('tp.category', 'category')
      .addSelect('COUNT(DISTINCT tp.userId)', 'totalPlayers')
      .addSelect('COUNT(DISTINCT team.tournamentId)', 'totalTournaments')
      .addSelect('AVG(team.points)', 'avgPoints')
      .groupBy('tp.category')
      .orderBy('tp.category', 'ASC')
      .getRawMany();

    const results: CategoryStatistics[] = [];

    for (const stat of categoryStats) {
      const category = Number(stat.category);
      
      const topPlayerQuery = await this.playerRepository
        .createQueryBuilder('tp')
        .innerJoin('tp.team', 'team')
        .innerJoin(User, 'u', 'u.id = tp.userId')
        .where('team.tournamentId IN (:...tournamentIds)', { tournamentIds })
        .andWhere('tp.category = :category', { category })
        .select('tp.userId', 'userId')
        .addSelect('u.firstName', 'firstName')
        .addSelect('u.lastName', 'lastName')
        .addSelect('SUM(team.points)', 'points')
        .groupBy('tp.userId')
        .addGroupBy('u.firstName')
        .addGroupBy('u.lastName')
        .orderBy('SUM(team.points)', 'DESC')
        .limit(1)
        .getRawOne();

      results.push({
        category,
        totalPlayers: Number(stat.totalPlayers ?? 0),
        totalTournaments: Number(stat.totalTournaments ?? 0),
        averagePointsPerPlayer: Math.round(Number(stat.avgPoints ?? 0) * 100) / 100,
        topPlayer: topPlayerQuery ? {
          userId: topPlayerQuery.userId,
          firstName: topPlayerQuery.firstName,
          lastName: topPlayerQuery.lastName,
          points: Number(topPlayerQuery.points ?? 0),
        } : undefined,
      });
    }

    return results;
  }

  private createEmptyPlayerStatistics(userId: string, user: User): PlayerStatistics {
    return {
      userId,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
      totalTournaments: 0,
      totalMatches: 0,
      matchesWon: 0,
      matchesLost: 0,
      winRate: 0,
      totalPoints: 0,
      averagePointsPerTournament: 0,
      setsWon: 0,
      setsLost: 0,
      gamesWon: 0,
      gamesLost: 0,
    };
  }
}
