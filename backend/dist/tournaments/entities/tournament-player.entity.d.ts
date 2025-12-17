import { User } from '../../users/entities/user.entity';
import { TournamentTeam } from './tournament-team.entity';
export declare class TournamentPlayer {
    id: string;
    userId: string;
    user: User;
    teamId: string;
    team: TournamentTeam;
    category: number | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TournamentPlayer>);
}
