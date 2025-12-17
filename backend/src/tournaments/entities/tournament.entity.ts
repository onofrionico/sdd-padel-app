import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TournamentRegistration } from './tournament-registration.entity';
import { TournamentMatch } from './tournament-match.entity';
import { TournamentTeam } from './tournament-team.entity';

export type TournamentStatus = 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentType = 'single_elimination' | 'double_elimination' | 'round_robin' | 'groups_knockout';

export interface TournamentSettings {
  maxTeams?: number;
  minTeams?: number;
  teamSize: number;
  categoryRange?: {
    min: number;
    max: number;
  };
  pointsDistribution: Record<string, number>; // stage/position -> points
  tiebreakers: string[]; // e.g., ['head_to_head', 'points_difference']
}

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 50 })
  status: TournamentStatus;

  @Column({ type: 'varchar', length: 50 })
  type: TournamentType;

  @Column({ type: 'jsonb', default: {} })
  settings: TournamentSettings;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'uuid' })
  associationId: string;

  @ManyToOne(() => Association, association => association.tournaments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'associationId' })
  association: Association;

  @OneToMany(() => TournamentRegistration, registration => registration.tournament)
  registrations: TournamentRegistration[];

  @OneToMany(() => TournamentMatch, match => match.tournament)
  matches: TournamentMatch[];

  @OneToMany(() => TournamentTeam, team => team.tournament)
  teams: TournamentTeam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Tournament>) {
    Object.assign(this, partial);
  }
}
