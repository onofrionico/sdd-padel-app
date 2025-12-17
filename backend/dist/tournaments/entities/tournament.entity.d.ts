import { Association } from '../../associations/entities/association.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TournamentMatch } from './tournament-match.entity';
import { TournamentTeam } from './tournament-team.entity';
export declare enum TournamentStatus {
    UPCOMING = "upcoming",
    REGISTRATION_OPEN = "registration_open",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TournamentType {
    SINGLE_ELIMINATION = "single_elimination",
    DOUBLE_ELIMINATION = "double_elimination",
    ROUND_ROBIN = "round_robin",
    GROUPS_KNOCKOUT = "groups_knockout"
}
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
