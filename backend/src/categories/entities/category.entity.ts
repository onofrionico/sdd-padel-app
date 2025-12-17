import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { Association } from '../../associations/entities/association.entity';

export enum CategoryLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CategoryLevel })
  level: CategoryLevel;

  @Column({ type: 'int' })
  minPoints: number;

  @Column({ type: 'int' })
  maxPoints: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  associationId: string | null;

  @ManyToOne(() => Association, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'associationId' })
  association: Association | null;

  // Usamos un string para evitar dependencia circular
  @OneToMany('Tournament', 'category')
  tournaments: any[]; // Usamos any temporalmente

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
