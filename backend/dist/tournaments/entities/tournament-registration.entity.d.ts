import { Tournament } from './tournament.entity';
import { TournamentTeam } from './tournament-team.entity';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export declare class TournamentRegistration {
    id: string;
    tournamentId: string;
    tournament: Tournament;
    teamId: string;
    team: TournamentTeam;
    status: RegistrationStatus;
    rejectionReason: string | null;
    registeredAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TournamentRegistration>);
}
