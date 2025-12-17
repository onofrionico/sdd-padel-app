import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AssociationMembership } from '../../associations/entities/association-membership.entity';
import { TournamentPlayer } from '../../tournaments/entities/tournament-player.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ORGANIZER = 'organizer'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender!: Gender | null;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ default: false })
  isVerified!: boolean;

  @OneToMany(() => AssociationMembership, membership => membership.user)
  associationMemberships!: AssociationMembership[];

  @OneToMany(() => TournamentPlayer, (player: TournamentPlayer) => player.user)
  tournamentPlayers!: TournamentPlayer[];

  @OneToMany(() => Notification, (notification: Notification) => notification.user)
  notifications!: Notification[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
