import { ApiProperty } from '@nestjs/swagger';

export class RankingUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class RankingEntryDto {
  @ApiProperty({ type: RankingUserDto })
  user: RankingUserDto;

  @ApiProperty({ example: 120 })
  points: number;

  @ApiProperty({ example: 3 })
  tournamentsCount: number;
}
