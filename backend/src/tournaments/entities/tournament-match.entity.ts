import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentTeam } from './tournament-team.entity';

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'walkover' | 'retired' | 'cancelled';

export interface MatchScore {
  sets: Array<{
    homeScore: number;
    awayScore: number;
  }>;
  winner?: 'home' | 'away';
  walkover?: boolean;
  retired?: boolean;
}

@Entity('tournament_matches')
export class TournamentMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tournamentId: string;

  @ManyToOne(() => Tournament, tournament => tournament.matches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column({ type: 'integer', nullable: true })
  round: number;

  @Column({ type: 'integer', nullable: true })
  matchNumber: number;

  @Column({ type: 'uuid', nullable: true })
  homeTeamId: string | null;

  @ManyToOne(() => TournamentTeam, { nullable: true })
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: TournamentTeam | null;

  @Column({ type: 'uuid', nullable: true })
  awayTeamId: string | null;

  @ManyToOne(() => TournamentTeam, { nullable: true })
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: TournamentTeam | null;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: MatchStatus;

  @Column({ type: 'jsonb', nullable: true })
  score: MatchScore;

  @Column({ type: 'timestamp', nullable: true })
  scheduledTime: Date;

  @Column({ type: 'uuid', nullable: true })
  courtId: string | null;

  @Column({ type: 'uuid', nullable: true })
  winnerTeamId: string | null;

  @ManyToOne(() => TournamentTeam, { nullable: true })
  @JoinColumn({ name: 'winnerTeamId' })
  winnerTeam: TournamentTeam | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<TournamentMatch>) {
    Object.assign(this, partial);
  }
}
