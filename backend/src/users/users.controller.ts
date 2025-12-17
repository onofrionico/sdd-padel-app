import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { PlayerService } from './player.service';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { SetMyCategoryDto } from './dto/set-my-category.dto';
import { UpdatePlayerProfileDto } from './dto/update-player-profile.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly playerService: PlayerService) {}

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
}
