import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PlayerService } from './player.service';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { SetMyCategoryDto } from './dto/set-my-category.dto';
import { UpdatePlayerProfileDto } from './dto/update-player-profile.dto';
import { StatisticsService } from '../rankings/statistics.service';
import { EnrollmentService } from '../tournaments/enrollment.service';
import { TournamentRegistration } from '../tournaments/entities/tournament-registration.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly playerService: PlayerService,
    private readonly statisticsService: StatisticsService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by name or email' })
  @ApiResponse({ status: HttpStatus.OK })
  async searchUsers(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      return { data: [] };
    }
    const users = await this.usersService.searchUsers(query);
    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      })),
    };
  }

  @Get('me/player-profile')
  @ApiOperation({ summary: 'View current player profile (includes association memberships)' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  async getMyPlayerProfile(@Req() req: { user: User }) {
    return this.playerService.getProfile(req.user.id);
  }

  @Put('me/player-profile')
  @ApiOperation({ summary: 'Update current player profile' })
  @ApiBody({ type: UpdatePlayerProfileDto })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  async updateMyPlayerProfile(
    @Req() req: { user: User },
    @Body() dto: UpdatePlayerProfileDto,
  ) {
    return this.playerService.updateProfile(req.user.id, dto);
  }

  @Post('me/player-registration')
  @ApiOperation({ summary: 'Register current user as a player in an association' })
  @ApiBody({ type: RegisterPlayerDto })
  @ApiResponse({ status: HttpStatus.CREATED })
  async registerAsPlayer(
    @Req() req: { user: User },
    @Body() dto: RegisterPlayerDto,
  ) {
    return this.playerService.registerInAssociation(req.user.id, dto);
  }

  @Put('me/associations/:associationId/category')
  @ApiOperation({ summary: 'Update my category for a specific association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiBody({ type: SetMyCategoryDto })
  @ApiResponse({ status: HttpStatus.OK })
  async setMyCategory(
    @Req() req: { user: User },
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Body() dto: SetMyCategoryDto,
  ) {
    return this.playerService.setCategory(req.user.id, associationId, dto.category);
  }

  @Get('me/enrollments')
  @ApiOperation({ summary: 'Get my tournament enrollments' })
  @ApiResponse({ status: HttpStatus.OK, type: [TournamentRegistration] })
  async getMyEnrollments(@Req() req: { user: User }) {
    return this.enrollmentService.getUserEnrollments(req.user.id);
  }

  @Get('me/statistics')
  @ApiOperation({ summary: 'Get my player statistics across all associations' })
  @ApiResponse({ status: HttpStatus.OK })
  async getMyStatistics(@Req() req: { user: User }) {
    const profile = await this.playerService.getProfile(req.user.id);
    
    if (!profile.associationMemberships || profile.associationMemberships.length === 0) {
      return {
        playerId: req.user.id,
        totalPoints: 0,
        totalTournaments: 0,
        totalMatches: 0,
        matchesWon: 0,
        matchesLost: 0,
        winRate: 0,
        categoriesPlayed: [],
        recentTournaments: [],
        bestRanking: null,
      };
    }

    let totalPoints = 0;
    let totalTournaments = 0;
    let totalMatches = 0;
    let matchesWon = 0;
    let matchesLost = 0;
    const categoriesSet = new Set<number>();
    const allTournaments: any[] = [];

    for (const membership of profile.associationMemberships) {
      try {
        const stats = await this.statisticsService.getPlayerStatistics({
          associationId: membership.associationId,
          userId: req.user.id,
        });

        totalPoints += stats.totalPoints;
        totalTournaments += stats.totalTournaments;
        totalMatches += stats.totalMatches;
        matchesWon += stats.matchesWon;
        matchesLost += stats.matchesLost;

        if (membership.category) {
          categoriesSet.add(membership.category);
        }
      } catch (error) {
        continue;
      }
    }

    const winRate = totalMatches > 0 ? matchesWon / totalMatches : 0;

    return {
      playerId: req.user.id,
      totalPoints,
      totalTournaments,
      totalMatches,
      matchesWon,
      matchesLost,
      winRate,
      categoriesPlayed: Array.from(categoriesSet),
      recentTournaments: allTournaments.slice(0, 10),
      bestRanking: null,
    };
  }
}
