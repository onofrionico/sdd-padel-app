import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ format: 'uuid', description: 'Enrollment ID' })
  @IsUUID()
  @IsNotEmpty()
  enrollmentId: string;

  @ApiProperty({ 
    enum: ['full_team', 'split'], 
    description: 'Payment type - full_team or split',
    default: 'full_team'
  })
  @IsEnum(['full_team', 'split'])
  paymentType: 'full_team' | 'split';
}
