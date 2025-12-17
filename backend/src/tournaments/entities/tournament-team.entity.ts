import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tournament } from './tournament.entity';
// Usamos import type para evitar dependencias circulares
import type { TournamentPlayer } from './tournament-player.entity';
import { TournamentRegistration } from './tournament-registration.entity';


@Entity('tournament_teams')
export class TournamentTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  tournamentId: string;

  @ManyToOne(() => Tournament, tournament => tournament.teams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @OneToMany('TournamentPlayer', 'team', { cascade: true })
  players: TournamentPlayer[];

  @OneToMany(() => TournamentRegistration, registration => registration.team)
  registrations: TournamentRegistration[];

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  matchesWon: number;

  @Column({ default: 0 })
  matchesLost: number;

  @Column({ default: 0 })
  setsWon: number;

  @Column({ default: 0 })
  setsLost: number;

  @Column({ default: 0 })
  gamesWon: number;

  @Column({ default: 0 })
  gamesLost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  seed: string | null;

  @Column({ type: 'boolean', default: false })
  isEliminated: boolean;

  constructor(partial: Partial<TournamentTeam>) {
    Object.assign(this, partial);
  }
}
