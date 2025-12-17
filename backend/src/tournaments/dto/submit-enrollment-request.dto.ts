import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitEnrollmentRequestDto {
  @ApiProperty({ format: 'uuid', description: 'Partner user ID' })
  @IsUUID()
  partnerId: string;

  @ApiPropertyOptional({ description: 'Optional team name' })
  @IsString()
  @IsOptional()
  teamName?: string;
}
