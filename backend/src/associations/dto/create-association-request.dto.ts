import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAssociationRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Points awarded per round (round number as key). Example: {"1": 1, "2": 3, "3": 7}',
    example: { '1': 1, '2': 3, '3': 7 },
  })
  @IsObject()
  @IsOptional() 
  pointsByRound?: Record<string, number>;
}
