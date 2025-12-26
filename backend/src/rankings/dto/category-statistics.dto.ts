import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopPlayerDto {
  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  points: number;
}

export class CategoryStatisticsDto {
  @ApiProperty({ description: 'Category number (1-8)', minimum: 1, maximum: 8 })
  category: number;

  @ApiProperty({ description: 'Total players in this category' })
  totalPlayers: number;

  @ApiProperty({ description: 'Total tournaments for this category' })
  totalTournaments: number;

  @ApiProperty({ description: 'Average points per player' })
  averagePointsPerPlayer: number;

  @ApiPropertyOptional({ type: TopPlayerDto, description: 'Top player in this category' })
  topPlayer?: TopPlayerDto;
}
