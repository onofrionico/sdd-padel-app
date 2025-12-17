import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    TOURNAMENT_INVITATION = "tournament_invitation",
    TEAM_INVITATION = "team_invitation",
    MATCH_SCHEDULED = "match_scheduled",
    MATCH_RESULT = "match_result",
    TOURNAMENT_UPDATE = "tournament_update",
    ASSOCIATION_INVITATION = "association_invitation",
    GENERAL = "general"
}
export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read",
    ARCHIVED = "archived"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    message: string;
    metadata: Record<string, any>;
    status: NotificationStatus;
    userId: string;
    user: User;
    isRead: boolean;
    createdAt: Date;
    readAt: Date | null;
    constructor(partial: Partial<Notification>);
}
