import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Association } from './association.entity';

@Entity('association_memberships')
export class AssociationMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.associationMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Association, association => association.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'associationId' })
  association: Association;

  @Column({ type: 'uuid' })
  associationId: string;

  @Column({ type: 'varchar', length: 50 })
  role: 'admin' | 'organizer' | 'member';

  @Column({ type: 'integer', nullable: true })
  category: number; // 1-8 for padel categories

  @Column({ default: 0 })
  points: number;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<AssociationMembership>) {
    Object.assign(this, partial);
  }
}
