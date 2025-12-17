import { AssociationMembership } from './association-membership.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
export declare class Association {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    website: string;
    isActive: boolean;
    members: AssociationMembership[];
    tournaments: Tournament[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Association>);
}
