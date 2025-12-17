import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentTeam } from './tournament-team.entity';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

@Entity('tournament_registrations')
export class TournamentRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tournamentId: string;

  @ManyToOne(() => Tournament, tournament => tournament.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column({ type: 'uuid' })
  teamId: string;

  @ManyToOne(() => TournamentTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: TournamentTeam;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: RegistrationStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  registeredAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<TournamentRegistration>) {
    Object.assign(this, partial);
  }
}
