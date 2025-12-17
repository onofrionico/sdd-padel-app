import { Tournament } from './tournament.entity';
import { TournamentTeam } from './tournament-team.entity';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'retired' | 'cancelled';
export interface MatchScore {
    sets: Array<{
        homeScore: number;
        awayScore: number;
    }>;
    winner?: 'home' | 'away';
    walkover?: boolean;
    retired?: boolean;
}
export declare class TournamentMatch {
    id: string;
    tournamentId: string;
    tournament: Tournament;
    round: number;
    matchNumber: number;
    homeTeamId: string | null;
    homeTeam: TournamentTeam | null;
    awayTeamId: string | null;
    awayTeam: TournamentTeam | null;
    status: MatchStatus;
    score: MatchScore;
    scheduledTime: Date;
    courtId: string | null;
    winnerTeamId: string | null;
    winnerTeam: TournamentTeam | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TournamentMatch>);
}
