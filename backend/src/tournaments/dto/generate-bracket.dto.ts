import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class GenerateBracketDto {
  @ApiPropertyOptional({
    description: 'When true, existing matches for the tournament will be deleted and re-generated',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  force?: boolean;
}
