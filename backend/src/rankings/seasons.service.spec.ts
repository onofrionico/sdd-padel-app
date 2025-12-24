import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { Season } from './entities/season.entity';
import { SeasonsService } from './seasons.service';

describe('SeasonsService', () => {
  let service: SeasonsService;

  let seasonRepository: Repository<Season>;
  let associationRepository: Repository<Association>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        {
          provide: getRepositoryToken(Season),
          useValue: {
            create: jest.fn((x: any) => x),
            save: jest.fn(async (x: any) => x),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Association),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SeasonsService);
    seasonRepository = module.get(getRepositoryToken(Season));
    associationRepository = module.get(getRepositoryToken(Association));
  });

  it('creates a season when valid and non-overlapping', async () => {
    (associationRepository.findOne as any).mockResolvedValue({ id: 'a1' });

    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    };
    (seasonRepository.createQueryBuilder as any).mockReturnValue(qb);

    const result = await service.createSeason({
      associationId: 'a1',
      name: 'Season 2025',
      startDate: new Date('2025-01-01T00:00:00.000Z'),
      endDate: new Date('2025-12-31T23:59:59.000Z'),
    });

    expect(result.associationId).toBe('a1');
    expect(result.name).toBe('Season 2025');
    expect(seasonRepository.save).toHaveBeenCalled();
  });

  it('rejects season when dates overlap', async () => {
    (associationRepository.findOne as any).mockResolvedValue({ id: 'a1' });

    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
    };
    (seasonRepository.createQueryBuilder as any).mockReturnValue(qb);

    await expect(
      service.createSeason({
        associationId: 'a1',
        name: 'Season 2025',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-12-31T23:59:59.000Z'),
      }),
    ).rejects.toThrow('Season dates overlap with an existing season');
  });

  it('rejects season when startDate is after endDate', async () => {
    (associationRepository.findOne as any).mockResolvedValue({ id: 'a1' });

    await expect(
      service.createSeason({
        associationId: 'a1',
        name: 'Season invalid',
        startDate: new Date('2025-12-31T23:59:59.000Z'),
        endDate: new Date('2025-01-01T00:00:00.000Z'),
      }),
    ).rejects.toThrow('startDate must be before endDate');
  });
});
