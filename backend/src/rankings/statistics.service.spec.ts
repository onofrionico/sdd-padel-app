import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Tournament, TournamentStatus } from '../tournaments/entities/tournament.entity';
import { TournamentMatch } from '../tournaments/entities/tournament-match.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';
import { TournamentTeam } from '../tournaments/entities/tournament-team.entity';
import { User } from '../users/entities/user.entity';
import { Season } from './entities/season.entity';
import { StatisticsService } from './statistics.service';
import { RankingsService } from './rankings.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let seasonRepository: Repository<Season>;
  let tournamentRepository: Repository<Tournament>;
  let matchRepository: Repository<TournamentMatch>;
  let teamRepository: Repository<TournamentTeam>;
  let playerRepository: Repository<TournamentPlayer>;
  let userRepository: Repository<User>;
  let rankingsService: RankingsService;

  const mockSeason = {
    id: 's1',
    associationId: 'a1',
    name: '2025 Season',
    startDate: new Date('2025-01-01T00:00:00.000Z'),
    endDate: new Date('2025-12-31T23:59:59.000Z'),
  } as Season;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Season),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentMatch),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentTeam),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentPlayer),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: RankingsService,
          useValue: {
            getCurrentSeason: jest.fn(),
            getRankings: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(StatisticsService);
    seasonRepository = module.get(getRepositoryToken(Season));
    tournamentRepository = module.get(getRepositoryToken(Tournament));
    matchRepository = module.get(getRepositoryToken(TournamentMatch));
    teamRepository = module.get(getRepositoryToken(TournamentTeam));
    playerRepository = module.get(getRepositoryToken(TournamentPlayer));
    userRepository = module.get(getRepositoryToken(User));
    rankingsService = module.get(RankingsService);
  });

  describe('getTournamentStatistics', () => {
    it('should return tournament statistics for a season', async () => {
      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);

      const mockTournaments = [
        { id: 't1', status: TournamentStatus.COMPLETED, teams: [], matches: [] },
        { id: 't2', status: TournamentStatus.IN_PROGRESS, teams: [], matches: [] },
        { id: 't3', status: TournamentStatus.UPCOMING, teams: [], matches: [] },
      ] as Tournament[];

      jest.spyOn(tournamentRepository, 'find').mockResolvedValue(mockTournaments);

      const matchQb: any = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '10', completed: '5' }),
      };
      jest.spyOn(matchRepository, 'createQueryBuilder').mockReturnValue(matchQb);

      const teamQb: any = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '20' }),
      };
      jest.spyOn(teamRepository, 'createQueryBuilder').mockReturnValue(teamQb);

      const playerQb: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '40' }),
      };
      jest.spyOn(playerRepository, 'createQueryBuilder').mockReturnValue(playerQb);

      const result = await service.getTournamentStatistics({ associationId: 'a1' });

      expect(result.totalTournaments).toBe(3);
      expect(result.completedTournaments).toBe(1);
      expect(result.inProgressTournaments).toBe(1);
      expect(result.upcomingTournaments).toBe(1);
      expect(result.totalMatches).toBe(10);
      expect(result.completedMatches).toBe(5);
      expect(result.totalTeams).toBe(20);
      expect(result.totalPlayers).toBe(40);
    });

    it('should throw NotFoundException when season not found', async () => {
      jest.spyOn(rankingsService, 'getCurrentSeason').mockRejectedValue(new NotFoundException('Season not found'));

      await expect(service.getTournamentStatistics({ associationId: 'a1' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPlayerStatistics', () => {
    it('should return player statistics for a user', async () => {
      const mockUser = { id: 'u1', firstName: 'John', lastName: 'Doe' } as User;

      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(tournamentRepository, 'find').mockResolvedValue([{ id: 't1' }] as Tournament[]);

      const playerQb: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          {
            teamId: 'team1',
            points: '100',
            matchesWon: '5',
            matchesLost: '2',
            setsWon: '10',
            setsLost: '4',
            gamesWon: '60',
            gamesLost: '40',
          },
        ]),
      };
      jest.spyOn(playerRepository, 'createQueryBuilder').mockReturnValue(playerQb);

      jest.spyOn(rankingsService, 'getRankings').mockResolvedValue({
        items: [
          { user: { id: 'other', firstName: 'Other', lastName: 'Player' }, points: 150, tournamentsCount: 2 },
          { user: { id: 'u1', firstName: 'John', lastName: 'Doe' }, points: 100, tournamentsCount: 1 },
        ],
        count: 2,
        page: 1,
        pageSize: 20,
        season: mockSeason,
      });

      const result = await service.getPlayerStatistics({ associationId: 'a1', userId: 'u1' });

      expect(result.userId).toBe('u1');
      expect(result.totalTournaments).toBe(1);
      expect(result.totalMatches).toBe(7);
      expect(result.matchesWon).toBe(5);
      expect(result.matchesLost).toBe(2);
      expect(result.winRate).toBeCloseTo(71.43, 1);
      expect(result.totalPoints).toBe(100);
      expect(result.currentRanking).toBe(2);
    });

    it('should throw NotFoundException when userId is not provided', async () => {
      await expect(service.getPlayerStatistics({ associationId: 'a1' })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getPlayerStatistics({ associationId: 'a1', userId: 'u1' })).rejects.toThrow(NotFoundException);
    });

    it('should return empty statistics when player has no tournaments', async () => {
      const mockUser = { id: 'u1', firstName: 'John', lastName: 'Doe' } as User;

      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(tournamentRepository, 'find').mockResolvedValue([]);

      const result = await service.getPlayerStatistics({ associationId: 'a1', userId: 'u1' });

      expect(result.userId).toBe('u1');
      expect(result.totalTournaments).toBe(0);
      expect(result.totalMatches).toBe(0);
      expect(result.totalPoints).toBe(0);
    });
  });

  describe('getCategoryStatistics', () => {
    it('should return statistics for all categories', async () => {
      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);
      jest.spyOn(tournamentRepository, 'find').mockResolvedValue([{ id: 't1' }] as Tournament[]);

      const categoryQb: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { category: '3', totalPlayers: '10', totalTournaments: '5', avgPoints: '50.5' },
          { category: '4', totalPlayers: '15', totalTournaments: '6', avgPoints: '45.2' },
        ]),
      };

      const topPlayerQb: any = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ userId: 'u1', firstName: 'John', lastName: 'Doe', points: '150' })
          .mockResolvedValueOnce({ userId: 'u2', firstName: 'Jane', lastName: 'Smith', points: '120' }),
      };

      jest.spyOn(playerRepository, 'createQueryBuilder')
        .mockReturnValueOnce(categoryQb)
        .mockReturnValue(topPlayerQb);

      const result = await service.getCategoryStatistics({ associationId: 'a1' });

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe(3);
      expect(result[0].totalPlayers).toBe(10);
      expect(result[0].topPlayer?.userId).toBe('u1');
      expect(result[1].category).toBe(4);
      expect(result[1].totalPlayers).toBe(15);
    });

    it('should return empty array when no tournaments exist', async () => {
      jest.spyOn(rankingsService, 'getCurrentSeason').mockResolvedValue(mockSeason);
      jest.spyOn(tournamentRepository, 'find').mockResolvedValue([]);

      const result = await service.getCategoryStatistics({ associationId: 'a1' });

      expect(result).toEqual([]);
    });
  });
});
