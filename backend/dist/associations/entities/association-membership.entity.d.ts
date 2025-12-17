import { User } from '../../users/entities/user.entity';
import { Association } from './association.entity';
export declare class AssociationMembership {
    id: string;
    user: User;
    userId: string;
    association: Association;
    associationId: string;
    role: 'admin' | 'organizer' | 'member';
    category: number;
    points: number;
    joinedAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<AssociationMembership>);
}
