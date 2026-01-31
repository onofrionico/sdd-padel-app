import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ type: 'number', description: 'Refund amount', example: 500.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Reason for refund', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
