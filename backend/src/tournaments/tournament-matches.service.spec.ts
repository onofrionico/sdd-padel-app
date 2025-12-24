import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationsService } from '../associations/associations.service';
import { User } from '../users/entities/user.entity';
import { TournamentMatchesService } from './tournament-matches.service';
import { Tournament } from './entities/tournament.entity';
import { TournamentMatch } from './entities/tournament-match.entity';
import { TournamentRegistration } from './entities/tournament-registration.entity';
import { TournamentTeam } from './entities/tournament-team.entity';

describe('TournamentMatchesService', () => {
  let service: TournamentMatchesService;

  let tournamentRepository: Repository<Tournament>;
  let matchRepository: Repository<TournamentMatch>;
  let registrationRepository: Repository<TournamentRegistration>;
  let teamRepository: Repository<TournamentTeam>;

  const associationsService = {
    getMembership: jest.fn(),
    findOne: jest.fn(),
  };

  const organizerUser = { id: 'u1', role: 'organizer' } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentMatchesService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentMatch),
          useValue: {
            count: jest.fn(),
            delete: jest.fn(),
            create: jest.fn((x: any) => x),
            save: jest.fn(async (x: any) => x),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentRegistration),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TournamentTeam),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(async (x: any) => x),
          },
        },
        {
          provide: AssociationsService,
          useValue: associationsService,
        },
      ],
    }).compile();

    service = module.get(TournamentMatchesService);
    tournamentRepository = module.get(getRepositoryToken(Tournament));
    matchRepository = module.get(getRepositoryToken(TournamentMatch));
    registrationRepository = module.get(getRepositoryToken(TournamentRegistration));
    teamRepository = module.get(getRepositoryToken(TournamentTeam));
  });

  it('generates a single-elimination bracket and creates round 1 matches', async () => {
    (tournamentRepository.findOne as any).mockResolvedValue({
      id: 't1',
      type: 'single_elimination',
      status: 'registration_open',
      associationId: 'a1',
    });

    (matchRepository.count as any).mockResolvedValue(0);

    const team1 = { id: 'team1' } as TournamentTeam;
    const team2 = { id: 'team2' } as TournamentTeam;

    (registrationRepository.find as any).mockResolvedValue([
      { team: team1 },
      { team: team2 },
    ]);

    (matchRepository.find as any).mockResolvedValue([
      { id: 'm1', tournamentId: 't1', round: 1, matchNumber: 1 },
    ]);

    const result = await service.generateBracket({
      tournamentId: 't1',
      requester: organizerUser,
    });

    expect(matchRepository.save).toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    expect(tournamentRepository.save).toHaveBeenCalled();
  });

  it('records a match result and updates standings', async () => {
    (tournamentRepository.findOne as any).mockResolvedValue({
      id: 't1',
      type: 'single_elimination',
      status: 'in_progress',
      associationId: 'a1',
    });

    (associationsService.findOne as any).mockResolvedValue({
      id: 'a1',
      pointsByRound: { '1': 5 },
    });

    (matchRepository.findOne as any)
      .mockResolvedValueOnce({
        id: 'm1',
        tournamentId: 't1',
        round: 1,
        matchNumber: 1,
        homeTeamId: 'team1',
        awayTeamId: 'team2',
        status: 'scheduled',
      })
      .mockResolvedValueOnce({
        id: 'm1',
        tournamentId: 't1',
        round: 2,
        matchNumber: 1,
        homeTeamId: null,
        awayTeamId: null,
        status: 'scheduled',
      });

    (teamRepository.findOne as any)
      .mockResolvedValueOnce({
        id: 'team1',
        tournamentId: 't1',
        points: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        isEliminated: false,
      })
      .mockResolvedValueOnce({
        id: 'team2',
        tournamentId: 't1',
        points: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        isEliminated: false,
      });

    (matchRepository.save as any).mockResolvedValue(undefined);

    const updated = await service.recordResult({
      tournamentId: 't1',
      matchId: 'm1',
      requester: organizerUser,
      score: {
        winner: 'home',
        sets: [
          { homeScore: 6, awayScore: 4 },
          { homeScore: 6, awayScore: 4 },
        ],
      },
    });

    expect(matchRepository.save).toHaveBeenCalled();
    expect(teamRepository.save).toHaveBeenCalled();

    const saveCalls = (teamRepository.save as any).mock.calls;
    const savedWinner = saveCalls[0][0];
    expect(savedWinner.id).toBe('team1');
    expect(savedWinner.points).toBe(5);

    expect(updated).toBeDefined();
  });
});
