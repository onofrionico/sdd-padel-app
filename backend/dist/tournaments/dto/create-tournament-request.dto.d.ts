import { TournamentStatus, TournamentType } from '../entities/tournament.entity';
declare class TournamentSettingsDto {
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
export declare class CreateTournamentRequestDto {
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    status: TournamentStatus;
    type: TournamentType;
    settings: TournamentSettingsDto;
    isPublic: boolean;
    associationId: string;
}
export {};
