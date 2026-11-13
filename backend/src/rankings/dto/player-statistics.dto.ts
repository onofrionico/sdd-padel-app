import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RankingUserDto } from './ranking-entry.dto';

export class PlayerStatisticsDto {
  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ type: RankingUserDto })
  user: RankingUserDto;

  @ApiProperty({ description: 'Total tournaments participated in' })
  totalTournaments: number;

  @ApiProperty({ description: 'Total matches played' })
  totalMatches: number;

  @ApiProperty({ description: 'Number of matches won' })
  matchesWon: number;

  @ApiProperty({ description: 'Number of matches lost' })
  matchesLost: number;

  @ApiProperty({ description: 'Win rate percentage', example: 65.5 })
  winRate: number;

  @ApiProperty({ description: 'Total points accumulated' })
  totalPoints: number;

  @ApiProperty({ description: 'Average points per tournament' })
  averagePointsPerTournament: number;

  @ApiProperty({ description: 'Total sets won' })
  setsWon: number;

  @ApiProperty({ description: 'Total sets lost' })
  setsLost: number;

  @ApiProperty({ description: 'Total games won' })
  gamesWon: number;

  @ApiProperty({ description: 'Total games lost' })
  gamesLost: number;

  @ApiPropertyOptional({ description: 'Current ranking position' })
  currentRanking?: number;

  @ApiPropertyOptional({ description: 'Best ranking position achieved' })
  bestRanking?: number;
}
