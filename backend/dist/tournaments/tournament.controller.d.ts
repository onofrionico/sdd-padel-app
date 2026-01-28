import { TournamentService, CreateTournamentDto, UpdateTournamentDto } from './tournament.service';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
declare class TournamentResponseDto extends Tournament {
}
declare class TournamentListResponseDto {
    tournaments: Tournament[];
    total: number;
    page: number;
    limit: number;
}
export declare class TournamentController {
    private readonly tournamentService;
    constructor(tournamentService: TournamentService);
    create(createTournamentDto: CreateTournamentDto): Promise<TournamentResponseDto>;
    findAll(page?: number, limit?: number, status?: TournamentStatus, associationId?: string, category?: string, search?: string): Promise<TournamentListResponseDto>;
    findOne(id: string): Promise<TournamentResponseDto>;
    update(id: string, updateTournamentDto: UpdateTournamentDto): Promise<TournamentResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: TournamentStatus): Promise<TournamentResponseDto>;
}
export {};
