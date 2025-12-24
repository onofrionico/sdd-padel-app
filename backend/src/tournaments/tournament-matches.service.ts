import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationsService } from '../associations/associations.service';
import { User } from '../users/entities/user.entity';
import { Tournament, TournamentStatus, TournamentType } from './entities/tournament.entity';
import { TournamentMatch } from './entities/tournament-match.entity';
import { TournamentRegistration } from './entities/tournament-registration.entity';
import { TournamentTeam } from './entities/tournament-team.entity';

@Injectable()
export class TournamentMatchesService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentMatch)
    private readonly matchRepository: Repository<TournamentMatch>,
    @InjectRepository(TournamentRegistration)
    private readonly registrationRepository: Repository<TournamentRegistration>,
    @InjectRepository(TournamentTeam)
    private readonly teamRepository: Repository<TournamentTeam>,
    private readonly associationsService: AssociationsService,
  ) {}

  async generateBracket(params: {
    tournamentId: string;
    requester: User;
    force?: boolean;
  }): Promise<TournamentMatch[]> {
    await this.assertOrganizer(params.tournamentId, params.requester);

    const tournament = await this.tournamentRepository.findOne({ where: { id: params.tournamentId } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.type !== TournamentType.SINGLE_ELIMINATION) {
      throw new BadRequestException('Only single_elimination bracket generation is supported');
    }

    const existing = await this.matchRepository.count({ where: { tournamentId: params.tournamentId } });
    if (existing > 0 && !params.force) {
      throw new BadRequestException('Bracket already generated');
    }

    if (existing > 0 && params.force) {
      await this.matchRepository.delete({ tournamentId: params.tournamentId } as any);
    }

    const registrations = await this.registrationRepository.find({
      where: { tournamentId: params.tournamentId, status: 'approved' },
      relations: { team: true },
      order: { registeredAt: 'ASC' },
    });

    const teams = registrations.map(r => r.team).filter(Boolean);
    if (teams.length < 2) {
      throw new BadRequestException('At least 2 approved teams are required to generate a bracket');
    }

    const bracketSize = this.nextPowerOfTwo(teams.length);
    const rounds = Math.log2(bracketSize);

    const seededTeams: Array<TournamentTeam | null> = [...teams];
    while (seededTeams.length < bracketSize) {
      seededTeams.push(null);
    }

    const matchesToCreate: TournamentMatch[] = [];

    let matchNumber = 1;
    for (let i = 0; i < bracketSize; i += 2) {
      const home = seededTeams[i];
      const away = seededTeams[i + 1];

      matchesToCreate.push(
        this.matchRepository.create({
          tournamentId: params.tournamentId,
          round: 1,
          matchNumber,
          homeTeamId: home?.id ?? null,
          awayTeamId: away?.id ?? null,
          status: 'scheduled',
        }),
      );

      matchNumber += 1;
    }

    for (let round = 2; round <= rounds; round += 1) {
      const matchesInRound = bracketSize / Math.pow(2, round);
      for (let m = 1; m <= matchesInRound; m += 1) {
        matchesToCreate.push(
          this.matchRepository.create({
            tournamentId: params.tournamentId,
            round,
            matchNumber: m,
            homeTeamId: null,
            awayTeamId: null,
            status: 'scheduled',
          }),
        );
      }
    }

    const saved = await this.matchRepository.save(matchesToCreate);

    await this.processByes(params.tournamentId);

    if (tournament.status === TournamentStatus.REGISTRATION_OPEN) {
      tournament.status = TournamentStatus.IN_PROGRESS;
      await this.tournamentRepository.save(tournament);
    }

    return this.listMatches(params.tournamentId);
  }

  async listMatches(tournamentId: string): Promise<TournamentMatch[]> {
    return this.matchRepository.find({
      where: { tournamentId },
      relations: { homeTeam: true, awayTeam: true, winnerTeam: true },
      order: { round: 'ASC', matchNumber: 'ASC' },
    });
  }

  async getMatch(params: { tournamentId: string; matchId: string }): Promise<TournamentMatch> {
    const match = await this.matchRepository.findOne({
      where: { id: params.matchId, tournamentId: params.tournamentId },
      relations: { homeTeam: true, awayTeam: true, winnerTeam: true },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async recordResult(params: {
    tournamentId: string;
    matchId: string;
    requester: User;
    score: {
      sets: Array<{ homeScore: number; awayScore: number }>;
      winner: 'home' | 'away';
      walkover?: boolean;
      retired?: boolean;
    };
  }): Promise<TournamentMatch> {
    await this.assertOrganizer(params.tournamentId, params.requester);

    const match = await this.matchRepository.findOne({
      where: { id: params.matchId, tournamentId: params.tournamentId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.status === 'completed') {
      throw new BadRequestException('Match is already completed');
    }

    if (!match.homeTeamId || !match.awayTeamId) {
      throw new BadRequestException('Match teams are not fully assigned');
    }

    const winnerTeamId = params.score.winner === 'home' ? match.homeTeamId : match.awayTeamId;
    const loserTeamId = params.score.winner === 'home' ? match.awayTeamId : match.homeTeamId;

    match.score = {
      sets: params.score.sets,
      winner: params.score.winner,
      walkover: params.score.walkover,
      retired: params.score.retired,
    };
    match.winnerTeamId = winnerTeamId;
    match.status = params.score.walkover ? 'walkover' : 'completed';

    await this.matchRepository.save(match);

    await this.updateStandingsForMatch({
      tournamentId: params.tournamentId,
      winnerTeamId,
      loserTeamId,
      winnerSide: params.score.winner,
      round: match.round ?? 1,
      sets: params.score.sets,
    });

    await this.advanceWinner(params.tournamentId, match);

    return this.getMatch({ tournamentId: params.tournamentId, matchId: params.matchId });
  }

  async listStandings(tournamentId: string): Promise<TournamentTeam[]> {
    return this.teamRepository.find({
      where: { tournamentId },
      order: {
        points: 'DESC',
        matchesWon: 'DESC',
        matchesLost: 'ASC',
        setsWon: 'DESC',
        setsLost: 'ASC',
        gamesWon: 'DESC',
        gamesLost: 'ASC',
      },
    });
  }

  private async processByes(tournamentId: string): Promise<void> {
    const round1 = await this.matchRepository.find({
      where: { tournamentId, round: 1 },
      order: { matchNumber: 'ASC' },
    });

    for (const match of round1) {
      if (match.homeTeamId && !match.awayTeamId) {
        match.score = { sets: [], winner: 'home', walkover: true };
        match.status = 'walkover';
        match.winnerTeamId = match.homeTeamId;
        await this.matchRepository.save(match);
        await this.advanceWinner(tournamentId, match);
      }

      if (!match.homeTeamId && match.awayTeamId) {
        match.score = { sets: [], winner: 'away', walkover: true };
        match.status = 'walkover';
        match.winnerTeamId = match.awayTeamId;
        await this.matchRepository.save(match);
        await this.advanceWinner(tournamentId, match);
      }
    }
  }

  private async advanceWinner(tournamentId: string, match: TournamentMatch): Promise<void> {
    if (!match.winnerTeamId) return;

    const nextRound = (match.round ?? 1) + 1;

    const bracketMatches = await this.matchRepository.count({ where: { tournamentId } });
    if (bracketMatches === 0) return;

    const nextMatchNumber = Math.ceil((match.matchNumber ?? 1) / 2);

    const nextMatch = await this.matchRepository.findOne({
      where: { tournamentId, round: nextRound, matchNumber: nextMatchNumber },
    });

    if (!nextMatch) {
      return;
    }

    const isHomeSlot = (match.matchNumber ?? 1) % 2 === 1;

    if (isHomeSlot) {
      if (!nextMatch.homeTeamId) {
        nextMatch.homeTeamId = match.winnerTeamId;
        await this.matchRepository.save(nextMatch);
      }
    } else {
      if (!nextMatch.awayTeamId) {
        nextMatch.awayTeamId = match.winnerTeamId;
        await this.matchRepository.save(nextMatch);
      }
    }

    if ((nextMatch.homeTeamId && !nextMatch.awayTeamId) || (!nextMatch.homeTeamId && nextMatch.awayTeamId)) {
      const winnerSide: 'home' | 'away' = nextMatch.homeTeamId ? 'home' : 'away';
      nextMatch.score = { sets: [], winner: winnerSide, walkover: true };
      nextMatch.status = 'walkover';
      nextMatch.winnerTeamId = nextMatch.homeTeamId ?? nextMatch.awayTeamId;
      await this.matchRepository.save(nextMatch);
      await this.advanceWinner(tournamentId, nextMatch);
    }
  }

  private async updateStandingsForMatch(params: {
    tournamentId: string;
    winnerTeamId: string;
    loserTeamId: string;
    winnerSide: 'home' | 'away';
    round: number;
    sets: Array<{ homeScore: number; awayScore: number }>;
  }): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({ where: { id: params.tournamentId } });
    if (!tournament) {
      return;
    }

    const pointsForRound = await this.getPointsForRound(tournament.associationId, params.round);

    const [winner, loser] = await Promise.all([
      this.teamRepository.findOne({ where: { id: params.winnerTeamId, tournamentId: params.tournamentId } }),
      this.teamRepository.findOne({ where: { id: params.loserTeamId, tournamentId: params.tournamentId } }),
    ]);

    if (!winner || !loser) {
      return;
    }

    let winnerSetsWon = 0;
    let loserSetsWon = 0;
    let winnerGamesWon = 0;
    let loserGamesWon = 0;

    for (const s of params.sets) {
      const winnerGames = params.winnerSide === 'home' ? s.homeScore : s.awayScore;
      const loserGames = params.winnerSide === 'home' ? s.awayScore : s.homeScore;

      winnerGamesWon += winnerGames;
      loserGamesWon += loserGames;

      if (winnerGames > loserGames) {
        winnerSetsWon += 1;
      } else if (loserGames > winnerGames) {
        loserSetsWon += 1;
      }
    }

    winner.matchesWon += 1;
    winner.points += pointsForRound;
    winner.setsWon += winnerSetsWon;
    winner.setsLost += loserSetsWon;
    winner.gamesWon += winnerGamesWon;
    winner.gamesLost += loserGamesWon;

    loser.matchesLost += 1;
    loser.setsWon += loserSetsWon;
    loser.setsLost += winnerSetsWon;
    loser.gamesWon += loserGamesWon;
    loser.gamesLost += winnerGamesWon;
    loser.isEliminated = true;

    await Promise.all([this.teamRepository.save(winner), this.teamRepository.save(loser)]);
  }

  private nextPowerOfTwo(n: number): number {
    let p = 1;
    while (p < n) p *= 2;
    return p;
  }

  private async getPointsForRound(associationId: string, round: number): Promise<number> {
    const association = await this.associationsService.findOne(associationId).catch(() => null);
    const pointsByRound: Record<string, number> | undefined = (association as any)?.pointsByRound;
    const configured = pointsByRound?.[String(round)];
    if (typeof configured === 'number' && Number.isFinite(configured)) {
      return configured;
    }
    return 1;
  }

  private async assertOrganizer(tournamentId: string, user: User): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (user.role === 'admin' || user.role === 'organizer') {
      return;
    }

    const membership = await this.associationsService
      .getMembership(tournament.associationId, user.id)
      .catch(() => null);

    const isAssociationOrganizer =
      membership?.role === 'admin' || membership?.role === 'organizer';

    if (!isAssociationOrganizer) {
      throw new ForbiddenException('Organizer permissions required');
    }
  }
}
