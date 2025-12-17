import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TournamentTeam } from './tournament-team.entity';

@Entity('tournament_players')
export class TournamentPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  teamId: string;

  @ManyToOne(() => TournamentTeam, team => team.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: TournamentTeam;

  @Column({ type: 'integer', nullable: true })
  category: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<TournamentPlayer>) {
    Object.assign(this, partial);
  }
}
