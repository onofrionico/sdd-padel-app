import { ApiProperty } from '@nestjs/swagger';

export class TournamentStatisticsDto {
  @ApiProperty({ description: 'Total number of tournaments in the season' })
  totalTournaments: number;

  @ApiProperty({ description: 'Number of completed tournaments' })
  completedTournaments: number;

  @ApiProperty({ description: 'Number of tournaments in progress' })
  inProgressTournaments: number;

  @ApiProperty({ description: 'Number of upcoming tournaments' })
  upcomingTournaments: number;

  @ApiProperty({ description: 'Total number of matches across all tournaments' })
  totalMatches: number;

  @ApiProperty({ description: 'Number of completed matches' })
  completedMatches: number;

  @ApiProperty({ description: 'Total number of teams' })
  totalTeams: number;

  @ApiProperty({ description: 'Total number of unique players' })
  totalPlayers: number;

  @ApiProperty({ description: 'Average teams per tournament' })
  averageTeamsPerTournament: number;

  @ApiProperty({ description: 'Average matches per tournament' })
  averageMatchesPerTournament: number;
}
