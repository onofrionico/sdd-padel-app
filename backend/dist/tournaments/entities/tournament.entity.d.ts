import { Association } from '../../associations/entities/association.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TournamentMatch } from './tournament-match.entity';
import { TournamentTeam } from './tournament-team.entity';
export type TournamentStatus = 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'groups_knockout';
export interface TournamentSettings {
    maxTeams?: number;
    minTeams?: number;
    teamSize: number;
    categoryRange?: {
        min: number;
        max: number;
    };
    pointsDistribution: Record<string, number>;
    tiebreakers: string[];
}
export declare class Tournament {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: TournamentStatus;
    type: TournamentType;
    settings: TournamentSettings;
    isPublic: boolean;
    associationId: string;
    association: Association;
    registrations: TournamentRegistration[];
    matches: TournamentMatch[];
    teams: TournamentTeam[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Tournament>);
}
