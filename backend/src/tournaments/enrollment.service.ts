import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationsService } from '../associations/associations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Tournament, TournamentStatus } from './entities/tournament.entity';
import { TournamentPlayer } from './entities/tournament-player.entity';
import { TournamentRegistration, RegistrationStatus } from './entities/tournament-registration.entity';
import { TournamentTeam } from './entities/tournament-team.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentTeam)
    private readonly teamRepository: Repository<TournamentTeam>,
    @InjectRepository(TournamentPlayer)
    private readonly playerRepository: Repository<TournamentPlayer>,
    @InjectRepository(TournamentRegistration)
    private readonly registrationRepository: Repository<TournamentRegistration>,
    private readonly associationsService: AssociationsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async submitEnrollmentRequest(params: {
    tournamentId: string;
    requester: User;
    partnerId: string;
    teamName?: string;
  }): Promise<TournamentRegistration> {
    if (params.partnerId === params.requester.id) {
      throw new BadRequestException('Partner must be a different user');
    }

    const tournament = await this.tournamentRepository.findOne({
      where: { id: params.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (tournament.status !== TournamentStatus.REGISTRATION_OPEN) {
      throw new BadRequestException('Tournament registration is not open');
    }

    const teamSize = tournament.settings?.teamSize ?? 2;
    if (teamSize !== 2) {
      throw new BadRequestException('Only teamSize=2 is supported for enrollment requests');
    }

    const requesterMembership = await this.associationsService.getMemberCategory(
      tournament.associationId,
      params.requester.id,
    );
    const partnerMembership = await this.associationsService.getMemberCategory(
      tournament.associationId,
      params.partnerId,
    );

    const existingForRequester = await this.playerRepository
      .createQueryBuilder('tp')
      .leftJoin('tp.team', 'team')
      .where('tp.userId = :userId', { userId: params.requester.id })
      .andWhere('team.tournamentId = :tournamentId', { tournamentId: params.tournamentId })
      .getCount();

    if (existingForRequester > 0) {
      throw new BadRequestException('Requester is already in a team for this tournament');
    }

    const existingForPartner = await this.playerRepository
      .createQueryBuilder('tp')
      .leftJoin('tp.team', 'team')
      .where('tp.userId = :userId', { userId: params.partnerId })
      .andWhere('team.tournamentId = :tournamentId', { tournamentId: params.tournamentId })
      .getCount();

    if (existingForPartner > 0) {
      throw new BadRequestException('Partner is already in a team for this tournament');
    }

    const team = await this.teamRepository.save(
      this.teamRepository.create({
        tournamentId: params.tournamentId,
        name:
          params.teamName?.trim() ||
          `${params.requester.firstName} ${params.requester.lastName} / Partner`,
      }),
    );

    await this.playerRepository.save(
      this.playerRepository.create({
        teamId: team.id,
        userId: params.requester.id,
        category: requesterMembership.category,
      }),
    );

    await this.playerRepository.save(
      this.playerRepository.create({
        teamId: team.id,
        userId: params.partnerId,
        category: partnerMembership.category,
      }),
    );

    const registration = await this.registrationRepository.save(
      this.registrationRepository.create({
        tournamentId: params.tournamentId,
        teamId: team.id,
        status: 'pending' as RegistrationStatus,
      }),
    );

    await this.notificationsService.create({
      userId: params.partnerId,
      type: NotificationType.TOURNAMENT_INVITATION,
      message: `You have been added to an enrollment request for tournament "${tournament.name}".`,
      metadata: { tournamentId: tournament.id, registrationId: registration.id, teamId: team.id },
    });

    return this.getRegistrationById(registration.id);
  }

  async listEnrollments(params: {
    tournamentId: string;
    requester: User;
    status?: RegistrationStatus;
  }): Promise<TournamentRegistration[]> {
    await this.assertOrganizer(params.tournamentId, params.requester);

    const where: any = { tournamentId: params.tournamentId };
    if (params.status) where.status = params.status;

    return this.registrationRepository.find({
      where,
      relations: {
        team: {
          players: {
            user: true,
          },
        },
      },
      order: { registeredAt: 'DESC' },
    });
  }

  async decideEnrollment(params: {
    tournamentId: string;
    registrationId: string;
    requester: User;
    decision: 'approved' | 'rejected';
    rejectionReason?: string;
  }): Promise<TournamentRegistration> {
    await this.assertOrganizer(params.tournamentId, params.requester);

    const registration = await this.registrationRepository.findOne({
      where: { id: params.registrationId, tournamentId: params.tournamentId },
      relations: { team: { players: true } },
    });

    if (!registration) {
      throw new NotFoundException('Enrollment request not found');
    }

    if (registration.status !== 'pending') {
      throw new BadRequestException('Enrollment request is not pending');
    }

    if (params.decision === 'rejected' && !params.rejectionReason?.trim()) {
      throw new BadRequestException('rejectionReason is required when rejecting');
    }

    registration.status = params.decision;
    registration.rejectionReason =
      params.decision === 'rejected' ? (params.rejectionReason ?? null) : null;

    await this.registrationRepository.save(registration);

    const tournament = await this.tournamentRepository.findOne({
      where: { id: params.tournamentId },
    });

    const players = registration.team?.players ?? [];
    for (const p of players) {
      await this.notificationsService.create({
        userId: p.userId,
        type: NotificationType.TOURNAMENT_UPDATE,
        message:
          params.decision === 'approved'
            ? `Your enrollment request was approved for tournament "${tournament?.name ?? ''}".`
            : `Your enrollment request was rejected for tournament "${tournament?.name ?? ''}".`,
        metadata: {
          tournamentId: params.tournamentId,
          registrationId: registration.id,
          decision: params.decision,
          rejectionReason: registration.rejectionReason,
        },
      });
    }

    return this.getRegistrationById(registration.id);
  }

  async listParticipants(tournamentId: string): Promise<TournamentTeam[]> {
    const registrations = await this.registrationRepository.find({
      where: { tournamentId, status: 'approved' },
      relations: {
        team: {
          players: {
            user: true,
          },
        },
      },
    });

    return registrations.map(r => r.team).filter(Boolean);
  }

  private async getRegistrationById(id: string): Promise<TournamentRegistration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: {
        team: {
          players: {
            user: true,
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Enrollment request not found');
    }

    return registration;
  }

  private async assertOrganizer(tournamentId: string, user: User): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({ where: { id: tournamentId } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (user.role === 'admin' || user.role === 'organizer') {
      return;
    }

    const membership = await this.associationsService
      .getMembership(tournament.associationId, user.id)
      .catch(() => null);

    const isAssociationOrganizer =
      membership?.role === 'admin' || membership?.role === 'organizer';

    if (!isAssociationOrganizer) {
      throw new ForbiddenException('Organizer permissions required');
    }
  }
}
