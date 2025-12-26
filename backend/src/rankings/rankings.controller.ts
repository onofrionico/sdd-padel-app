import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSeasonDto } from './dto/create-season.dto';
import { GetRankingsQueryDto } from './dto/get-rankings-query.dto';
import { RankingEntryDto } from './dto/ranking-entry.dto';
import { TournamentStatisticsDto } from './dto/tournament-statistics.dto';
import { PlayerStatisticsDto } from './dto/player-statistics.dto';
import { CategoryStatisticsDto } from './dto/category-statistics.dto';
import { Season } from './entities/season.entity';
import { RankingsService } from './rankings.service';
import { SeasonsService } from './seasons.service';
import { StatisticsService } from './statistics.service';

@ApiTags('Rankings')
@ApiBearerAuth()
@Controller('associations/:associationId')
export class RankingsController {
  constructor(
    private readonly seasonsService: SeasonsService,
    private readonly rankingsService: RankingsService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Post('seasons')
  @ApiOperation({ summary: 'Create a season for an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiBody({ type: CreateSeasonDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Season })
  async createSeason(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Body() dto: CreateSeasonDto,
  ): Promise<Season> {
    return this.seasonsService.createSeason({
      associationId,
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
  }

  @Get('seasons')
  @ApiOperation({ summary: 'List seasons for an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: [Season] })
  async listSeasons(
    @Param('associationId', ParseUUIDPipe) associationId: string,
  ): Promise<Season[]> {
    return this.seasonsService.listSeasons(associationId);
  }

  @Get('seasons/current')
  @ApiOperation({ summary: 'Get current season for an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: Season })
  async getCurrentSeason(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Query('date') date?: string,
  ): Promise<Season> {
    const at = date ? new Date(date) : new Date();
    return this.rankingsService.getCurrentSeason(associationId, at);
  }

  @Get('rankings')
  @ApiOperation({ summary: 'Get player rankings for an association and season' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, schema: { type: 'object' } })
  async getRankings(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Query() query: GetRankingsQueryDto,
  ): Promise<{ items: RankingEntryDto[]; count: number; page: number; pageSize: number; season: Season }> {
    const result = await this.rankingsService.getRankings({
      associationId,
      seasonId: query.seasonId,
      category: query.category,
      page: query.page,
      limit: query.limit,
    });

    const startPosition = (result.page - 1) * result.pageSize;

    return {
      items: result.items.map((i, index) => ({
        position: startPosition + index + 1,
        user: i.user,
        points: i.points,
        tournamentsCount: i.tournamentsCount,
      })),
      count: result.count,
      page: result.page,
      pageSize: result.pageSize,
      season: result.season,
    };
  }

  @Get('statistics/tournaments')
  @ApiOperation({ summary: 'Get tournament statistics for an association and season' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: TournamentStatisticsDto })
  async getTournamentStatistics(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Query() query: GetRankingsQueryDto,
  ): Promise<TournamentStatisticsDto> {
    return this.statisticsService.getTournamentStatistics({
      associationId,
      seasonId: query.seasonId,
      category: query.category,
    });
  }

  @Get('statistics/players/:userId')
  @ApiOperation({ summary: 'Get player statistics for a specific user' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: PlayerStatisticsDto })
  async getPlayerStatistics(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: GetRankingsQueryDto,
  ): Promise<PlayerStatisticsDto> {
    return this.statisticsService.getPlayerStatistics({
      associationId,
      userId,
      seasonId: query.seasonId,
      category: query.category,
    });
  }

  @Get('statistics/categories')
  @ApiOperation({ summary: 'Get statistics for all categories in an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: [CategoryStatisticsDto] })
  async getCategoryStatistics(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Query() query: GetRankingsQueryDto,
  ): Promise<CategoryStatisticsDto[]> {
    return this.statisticsService.getCategoryStatistics({
      associationId,
      seasonId: query.seasonId,
    });
  }
}
