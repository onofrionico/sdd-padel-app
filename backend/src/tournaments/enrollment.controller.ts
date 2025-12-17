import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RegistrationStatus, TournamentRegistration } from './entities/tournament-registration.entity';
import { TournamentTeam } from './entities/tournament-team.entity';
import { DecideEnrollmentRequestDto } from './dto/decide-enrollment-request.dto';
import { SubmitEnrollmentRequestDto } from './dto/submit-enrollment-request.dto';
import { EnrollmentService } from './enrollment.service';

@ApiTags('Tournament Enrollment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tournaments/:tournamentId')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('enrollments')
  @ApiOperation({ summary: 'Submit enrollment request (player + partner)' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiResponse({ status: 201, type: TournamentRegistration })
  async submitEnrollment(
    @Req() req: { user: User },
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Body() dto: SubmitEnrollmentRequestDto,
  ) {
    return this.enrollmentService.submitEnrollmentRequest({
      tournamentId,
      requester: req.user,
      partnerId: dto.partnerId,
      teamName: dto.teamName,
    });
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'List enrollment requests (organizer)' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiResponse({ status: 200, type: [TournamentRegistration] })
  async listEnrollments(
    @Req() req: { user: User },
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Query('status') status?: RegistrationStatus,
  ) {
    const allowedStatuses: RegistrationStatus[] = ['pending', 'approved', 'rejected', 'withdrawn'];
    if (status && !allowedStatuses.includes(status)) {
      status = undefined;
    }

    return this.enrollmentService.listEnrollments({
      tournamentId,
      requester: req.user,
      status,
    });
  }

  @Put('enrollments/:registrationId/decision')
  @ApiOperation({ summary: 'Approve/Reject enrollment request (organizer)' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiParam({ name: 'registrationId', format: 'uuid' })
  @ApiResponse({ status: 200, type: TournamentRegistration })
  async decide(
    @Req() req: { user: User },
    @Param('tournamentId', ParseUUIDPipe) tournamentId: string,
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body() dto: DecideEnrollmentRequestDto,
  ) {
    return this.enrollmentService.decideEnrollment({
      tournamentId,
      registrationId,
      requester: req.user,
      decision: dto.decision,
      rejectionReason: dto.rejectionReason,
    });
  }

  @Get('participants')
  @ApiOperation({ summary: 'View tournament participants (approved teams)' })
  @ApiParam({ name: 'tournamentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [TournamentTeam] })
  async listParticipants(@Param('tournamentId', ParseUUIDPipe) tournamentId: string) {
    return this.enrollmentService.listParticipants(tournamentId);
  }
}
