import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from './payment.entity';
import { User } from '../../users/entities/user.entity';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

@Entity('refunds')
export class Refund {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.refunds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ApiProperty({ type: 'number', example: 500.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: 'Tournament cancelled', required: false })
  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @ApiProperty({ enum: ['pending', 'processing', 'completed', 'failed'] })
  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: RefundStatus;

  @ApiProperty({ example: '9876543210', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalRefundId: string | null;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  initiatedBy: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'initiatedBy' })
  initiator: User;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt: Date | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  constructor(partial: Partial<Refund>) {
    Object.assign(this, partial);
  }
}
