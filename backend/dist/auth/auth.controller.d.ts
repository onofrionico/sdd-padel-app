import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notifications: import("../notifications/entities/notification.entity").Notification[];
            email: string;
            firstName: string;
            lastName: string;
            phoneNumber?: string | undefined;
            role: import("../users/entities/user.entity").UserRole;
            gender: import("../users/entities/user.entity").Gender | null;
            dateOfBirth?: Date | undefined;
            profilePicture?: string | undefined;
            isVerified: boolean;
            associationMemberships: import("../associations/entities/association-membership.entity").AssociationMembership[];
            tournamentPlayers: import("../tournaments/entities/tournament-player.entity").TournamentPlayer[];
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notifications: import("../notifications/entities/notification.entity").Notification[];
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string | undefined;
        role: import("../users/entities/user.entity").UserRole;
        gender: import("../users/entities/user.entity").Gender | null;
        dateOfBirth?: Date | undefined;
        profilePicture?: string | undefined;
        isVerified: boolean;
        associationMemberships: import("../associations/entities/association-membership.entity").AssociationMembership[];
        tournamentPlayers: import("../tournaments/entities/tournament-player.entity").TournamentPlayer[];
    }>;
    getProfile(req: {
        user: User;
    }): User;
}
