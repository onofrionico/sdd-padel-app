import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SetScoreDto {
  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  @Max(99)
  homeScore: number;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  @Max(99)
  awayScore: number;
}

export class RecordMatchResultDto {
  @ApiProperty({ type: [SetScoreDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => SetScoreDto)
  sets: SetScoreDto[];

  @ApiProperty({ enum: ['home', 'away'] })
  @IsIn(['home', 'away'])
  winner: 'home' | 'away';

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  walkover?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  retired?: boolean;
}
