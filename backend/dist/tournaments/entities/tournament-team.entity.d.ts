import { Tournament } from './tournament.entity';
import type { TournamentPlayer } from './tournament-player.entity';
import { TournamentRegistration } from './tournament-registration.entity';
export declare class TournamentTeam {
    id: string;
    name: string;
    tournamentId: string;
    tournament: Tournament;
    players: TournamentPlayer[];
    registrations: TournamentRegistration[];
    points: number;
    matchesWon: number;
    matchesLost: number;
    setsWon: number;
    setsLost: number;
    gamesWon: number;
    gamesLost: number;
    createdAt: Date;
    updatedAt: Date;
    seed: string | null;
    isEliminated: boolean;
    constructor(partial: Partial<TournamentTeam>);
}
