import { AssociationMembership } from '../../associations/entities/association-membership.entity';
import { TournamentPlayer } from '../../tournaments/entities/tournament-player.entity';
import { Notification } from '../../notifications/entities/notification.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    ORGANIZER = "organizer"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
    PREFER_NOT_TO_SAY = "prefer_not_to_say"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: UserRole;
    gender: Gender | null;
    dateOfBirth?: Date;
    profilePicture?: string;
    isVerified: boolean;
    associationMemberships: AssociationMembership[];
    tournamentPlayers: TournamentPlayer[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial?: Partial<User>);
}
