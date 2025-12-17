import { Repository } from 'typeorm';
import { Tournament, TournamentStatus, TournamentType, TournamentSettings } from './entities/tournament.entity';
import { Association } from '../associations/entities/association.entity';
interface FindAllOptions {
    skip?: number;
    take?: number;
    where?: any;
}
export interface CreateTournamentDto {
    name: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    type: TournamentType;
    settings: TournamentSettings;
    isPublic?: boolean;
    associationId: string;
}
export interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
    status?: TournamentStatus;
}
export declare class TournamentService {
    private readonly tournamentRepository;
    private readonly associationRepository;
    constructor(tournamentRepository: Repository<Tournament>, associationRepository: Repository<Association>);
    create(createTournamentDto: CreateTournamentDto): Promise<Tournament>;
    findAll(options?: FindAllOptions): Promise<[Tournament[], number]>;
    findOne(id: string): Promise<Tournament>;
    update(id: string, updateTournamentDto: UpdateTournamentDto): Promise<Tournament>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: TournamentStatus): Promise<Tournament>;
    private hasMatches;
}
export {};
