import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Association } from '../../associations/entities/association.entity';

@Entity('seasons')
@Index('IDX_seasons_associationId', ['associationId'])
@Index('IDX_seasons_associationId_startDate_endDate', ['associationId', 'startDate', 'endDate'])
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  associationId: string;

  @ManyToOne(() => Association, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'associationId' })
  association: Association;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Season>) {
    Object.assign(this, partial);
  }
}
