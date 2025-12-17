import { TournamentService, CreateTournamentDto, UpdateTournamentDto } from './tournament.service';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
declare class TournamentResponseDto extends Tournament {
}
declare class TournamentListResponseDto {
    items: Tournament[];
    count: number;
    page: number;
    pageSize: number;
}
export declare class TournamentController {
    private readonly tournamentService;
    constructor(tournamentService: TournamentService);
    create(createTournamentDto: CreateTournamentDto): Promise<TournamentResponseDto>;
    findAll(page?: number, limit?: number, status?: TournamentStatus): Promise<TournamentListResponseDto>;
    findOne(id: string): Promise<TournamentResponseDto>;
    update(id: string, updateTournamentDto: UpdateTournamentDto): Promise<TournamentResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: TournamentStatus): Promise<TournamentResponseDto>;
}
export {};
