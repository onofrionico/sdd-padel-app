import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @ApiProperty({ description: 'Webhook event type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Payment data from gateway' })
  @IsObject()
  @IsNotEmpty()
  data: any;

  @ApiProperty({ description: 'Webhook ID', required: false })
  @IsString()
  @IsOptional()
  id?: string;
}
