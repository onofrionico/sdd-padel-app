import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { GenerateBracketDto } from './dto/generate-bracket.dto';
import { RecordMatchResultDto } from './dto/record-match-result.dto';
import { TournamentMatch } from './entities/tournament-match.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { TournamentMatchesService } from './tournament-matches.service';

@ApiTags('Tournament Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tournaments/:tournamentId')
export class TournamentMatchesController {
  constructor(private readonly matchesService: TournamentMatchesService) {}

  @Post('bracket')
  @ApiOperation({ summary: 'Generate tournament bracket (single elimination)' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiResponse({ status: 201, type: [TournamentMatch] })
  async generateBracket(
    @Req() req: { user: User },
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Body() dto: GenerateBracketDto,
  ) {
    return this.matchesService.generateBracket({
      tournamentId,
      requester: req.user,
      force: dto.force,
    });
  }

  @Get('matches')
  @ApiOperation({ summary: 'List tournament matches' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [TournamentMatch] })
  async listMatches(@Param('tournamentId', ParseUUIDPipe) tournamentId: string) {
    return this.matchesService.listMatches(tournamentId);
  }

  @Get('matches/:matchId')
  @ApiOperation({ summary: 'Get tournament match details' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiParam({ name: 'matchId', format: 'uuid' })
  @ApiResponse({ status: 200, type: TournamentMatch })
  async getMatch(
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Param('matchId', ParseUUIDPipe) matchId: string,
  ) {
    return this.matchesService.getMatch({ tournamentId, matchId });
  }

  @Put('matches/:matchId/result')
  @ApiOperation({ summary: 'Record match result and update standings' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiParam({ name: 'matchId', format: 'uuid' })
  @ApiResponse({ status: 200, type: TournamentMatch })
  async recordResult(
    @Req() req: { user: User },
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @Body() dto: RecordMatchResultDto,
  ) {
    return this.matchesService.recordResult({
      tournamentId,
      matchId,
      requester: req.user,
      score: {
        sets: dto.sets,
        winner: dto.winner,
        walkover: dto.walkover,
        retired: dto.retired,
      },
    });
  }

  @Get('standings')
  @ApiOperation({ summary: 'Get tournament standings' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [TournamentTeam] })
  async standings(@Param('tournamentId', ParseUUIDPipe) tournamentId: string) {
    return this.matchesService.listStandings(tournamentId);
  }
}
