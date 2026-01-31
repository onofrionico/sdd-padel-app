import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from './payment.entity';

export type PaymentEventType =
  | 'created'
  | 'initiated'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refund_initiated'
  | 'refunded'
  | 'expired'
  | 'cancelled';

@Entity('payment_events')
export class PaymentEvent {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ApiProperty({
    enum: ['created', 'initiated', 'processing', 'completed', 'failed', 'refund_initiated', 'refunded', 'expired', 'cancelled'],
  })
  @Column({ type: 'varchar', length: 50 })
  eventType: PaymentEventType;

  @ApiProperty({ type: Object })
  @Column({ type: 'jsonb', default: {} })
  eventData: Record<string, any>;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  constructor(partial: Partial<PaymentEvent>) {
    Object.assign(this, partial);
  }
}
