import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  TOURNAMENT_INVITATION = 'tournament_invitation',
  TEAM_INVITATION = 'team_invitation',
  MATCH_SCHEDULED = 'match_scheduled',
  MATCH_RESULT = 'match_result',
  TOURNAMENT_UPDATE = 'tournament_update',
  ASSOCIATION_INVITATION = 'association_invitation',
  PAYMENT_REQUIRED = 'payment_required',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_DEADLINE_REMINDER_24H = 'payment_deadline_reminder_24h',
  PAYMENT_DEADLINE_REMINDER_12H = 'payment_deadline_reminder_12h',
  PAYMENT_DEADLINE_REMINDER_2H = 'payment_deadline_reminder_2h',
  TEAM_PAYMENT_COMPLETED = 'team_payment_completed',
  REFUND_PROCESSED = 'refund_processed',
  GENERAL = 'general'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column('text')
  message: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date | null;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
  }
}
