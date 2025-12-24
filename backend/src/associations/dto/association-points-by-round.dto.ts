import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssociationPointsByRoundDto {
  @ApiProperty({ description: 'Round number (1-based) as string key', example: 1 })
  @IsInt()
  @Min(1)
  round: number;

  @ApiProperty({ description: 'Points awarded for winning a match in this round', example: 10 })
  @IsInt()
  value: number;
}
