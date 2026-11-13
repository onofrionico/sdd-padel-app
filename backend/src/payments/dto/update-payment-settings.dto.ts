import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsBoolean, 
  IsNotEmpty, 
  IsNumber, 
  IsObject, 
  IsOptional, 
  IsString, 
  Min, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

class RefundPolicyDto {
  @ApiPropertyOptional({ description: 'Hours before tournament for full refund' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fullRefundDeadlineHours?: number;

  @ApiPropertyOptional({ description: 'Percentage refunded after full refund deadline' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  partialRefundPercentage?: number;

  @ApiPropertyOptional({ description: 'Hours before tournament when no refunds are given' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  noRefundDeadlineHours?: number;

  @ApiPropertyOptional({ description: 'Whether to refund platform fee' })
  @IsBoolean()
  @IsOptional()
  refundPlatformFee?: boolean;
}

export class UpdatePaymentSettingsDto {
  @ApiProperty({ description: 'Whether deposit is required' })
  @IsBoolean()
  @IsNotEmpty()
  requiresDeposit: boolean;

  @ApiPropertyOptional({ description: 'Deposit amount' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  depositAmount?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'ARS' })
  @IsString()
  @IsOptional()
  depositCurrency?: string;

  @ApiPropertyOptional({ description: 'Total tournament fee' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalFee?: number;

  @ApiPropertyOptional({ description: 'Hours after approval to complete payment' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  paymentDeadlineHours?: number;

  @ApiPropertyOptional({ description: 'Allow one player to pay for entire team', default: true })
  @IsBoolean()
  @IsOptional()
  allowTeamPayment?: boolean;

  @ApiPropertyOptional({ description: 'Allow players to pay separately', default: true })
  @IsBoolean()
  @IsOptional()
  allowSplitPayment?: boolean;

  @ApiPropertyOptional({ description: 'Platform fee percentage', default: 5.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  platformFeePercentage?: number;

  @ApiPropertyOptional({ description: 'Refund policy configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => RefundPolicyDto)
  @IsOptional()
  refundPolicy?: RefundPolicyDto;
}
