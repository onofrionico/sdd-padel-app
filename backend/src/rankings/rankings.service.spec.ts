import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity';
import { Season } from './entities/season.entity';
import { RankingsService } from './rankings.service';

describe('RankingsService', () => {
  let service: RankingsService;

  let seasonRepository: Repository<Season>;
  let tournamentRepository: Repository<Tournament>;
  let playerRepository: Repository<TournamentPlayer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
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
          provide: getRepositoryToken(TournamentPlayer),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(RankingsService);
    seasonRepository = module.get(getRepositoryToken(Season));
    tournamentRepository = module.get(getRepositoryToken(Tournament));
    playerRepository = module.get(getRepositoryToken(TournamentPlayer));
  });

  it('getCurrentSeason returns matching season by date', async () => {
    (seasonRepository.find as any).mockResolvedValue([
      {
        id: 's1',
        associationId: 'a1',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-12-31T23:59:59.000Z'),
      },
    ]);

    const result = await service.getCurrentSeason('a1', new Date('2025-06-01T00:00:00.000Z'));
    expect(result.id).toBe('s1');
  });

  it('getRankings returns empty list when no tournaments are in season', async () => {
    (seasonRepository.find as any).mockResolvedValue([
      {
        id: 's1',
        associationId: 'a1',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-12-31T23:59:59.000Z'),
      },
    ]);

    (tournamentRepository.find as any).mockResolvedValue([]);

    const result = await service.getRankings({ associationId: 'a1' });
    expect(result.items).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('getRankings aggregates rows and paginates', async () => {
    const season = {
      id: 's1',
      associationId: 'a1',
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-12-31T23:59:59.000Z'),
    } as Season;

    (seasonRepository.findOne as any).mockResolvedValue(season);

    (tournamentRepository.find as any).mockResolvedValue([{ id: 't1' }, { id: 't2' }]);

    const qb: any = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { userId: 'u1', firstName: 'A', lastName: 'Z', points: '10', tournamentsCount: '2' },
        { userId: 'u2', firstName: 'B', lastName: 'Y', points: '8', tournamentsCount: '1' },
      ]),
    };

    (playerRepository.createQueryBuilder as any).mockReturnValue(qb);

    const result = await service.getRankings({ associationId: 'a1', seasonId: 's1', page: 1, limit: 1 });

    expect(result.count).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].user.id).toBe('u1');
    expect(result.items[0].points).toBe(10);
  });

  it('getRankings applies category filter when provided', async () => {
    const season = {
      id: 's1',
      associationId: 'a1',
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-12-31T23:59:59.000Z'),
    } as Season;

    (seasonRepository.findOne as any).mockResolvedValue(season);
    (tournamentRepository.find as any).mockResolvedValue([{ id: 't1' }]);

    const qb: any = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    (playerRepository.createQueryBuilder as any).mockReturnValue(qb);

    await service.getRankings({ associationId: 'a1', seasonId: 's1', category: 4 });
    expect(qb.andWhere).toHaveBeenCalledWith('tp.category = :category', { category: 4 });
  });
});
