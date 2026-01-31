import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TournamentRegistration } from '../../tournaments/entities/tournament-registration.entity';
import { User } from '../../users/entities/user.entity';
import type { PaymentEvent } from './payment-event.entity';
import type { Refund } from './refund.entity';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentType = 'full_team' | 'split' | 'deposit' | 'full_fee';

@Entity('payments')
export class Payment {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  enrollmentId: string;

  @ManyToOne(() => TournamentRegistration, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enrollmentId' })
  enrollment: TournamentRegistration;

  @ApiProperty({ type: 'number', example: 1000.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ type: 'number', example: 50.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @ApiProperty({ type: 'number', example: 30.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gatewayFee: number;

  @ApiProperty({ type: 'number', example: 920.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netAmount: number;

  @ApiProperty({ example: 'ARS' })
  @Column({ type: 'varchar', length: 3, default: 'ARS' })
  currency: string;

  @ApiProperty({ enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'] })
  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: PaymentStatus;

  @ApiProperty({ enum: ['full_team', 'split', 'deposit', 'full_fee'] })
  @Column({ type: 'varchar', length: 20, default: 'full_team' })
  paymentType: PaymentType;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  paidBy: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'paidBy' })
  payer: User;

  @ApiProperty({ example: 'credit_card', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: string | null;

  @ApiProperty({ example: 'mercadopago' })
  @Column({ type: 'varchar', length: 50 })
  paymentGateway: string;

  @ApiProperty({ example: '1234567890', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalTransactionId: string | null;

  @ApiProperty({ example: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=xxx', required: false })
  @Column({ type: 'text', nullable: true })
  paymentUrl: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  paidAt: Date | null;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @ApiProperty({ type: Object })
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany('PaymentEvent', 'payment')
  events: PaymentEvent[];

  @OneToMany('Refund', 'payment')
  refunds: Refund[];

  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
}
