import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AssociationMembership } from './association-membership.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity('associations')
export class Association {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AssociationMembership, membership => membership.association)
  members: AssociationMembership[];

  @OneToMany(() => Tournament, tournament => tournament.association)
  tournaments: Tournament[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Association>) {
    Object.assign(this, partial);
  }
}
