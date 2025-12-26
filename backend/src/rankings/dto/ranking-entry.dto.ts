import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RankingUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class RankingEntryDto {
  @ApiPropertyOptional({ description: 'Ranking position (1-based)', example: 1 })
  position?: number;

  @ApiProperty({ type: RankingUserDto })
  user: RankingUserDto;

  @ApiProperty({ example: 120 })
  points: number;

  @ApiProperty({ example: 3 })
  tournamentsCount: number;
}
