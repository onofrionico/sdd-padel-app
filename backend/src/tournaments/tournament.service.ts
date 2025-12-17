import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament, TournamentStatus, TournamentType, TournamentSettings } from './entities/tournament.entity';
import { Association } from '../associations/entities/association.entity';

interface FindAllOptions {
  skip?: number;
  take?: number;
  where?: any;
}

export interface CreateTournamentDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: TournamentType;
  settings: TournamentSettings;
  isPublic?: boolean;
  associationId: string;
}

export interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
  status?: TournamentStatus;
}

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Association)
    private readonly associationRepository: Repository<Association>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const association = await this.associationRepository.findOne({
      where: { id: createTournamentDto.associationId },
    });

    if (!association) {
      throw new NotFoundException('Association not found');
    }

    const tournament = this.tournamentRepository.create({
      ...createTournamentDto,
      association,
      status: TournamentStatus.UPCOMING,
    });

    return this.tournamentRepository.save(tournament);
  }

  async findAll(options: FindAllOptions = {}): Promise<[Tournament[], number]> {
    const [items, count] = await this.tournamentRepository.findAndCount({
      relations: ['association'],
      skip: options.skip,
      take: options.take,
      where: options.where,
    });

    return [items, count];
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ['association'],
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto): Promise<Tournament> {
    const tournament = await this.findOne(id);
    const updateData: Partial<Tournament> = { ...updateTournamentDto };

    if (updateTournamentDto.associationId) {
      const association = await this.associationRepository.findOne({
        where: { id: updateTournamentDto.associationId },
      });

      if (!association) {
        throw new NotFoundException('Association not found');
      }
      updateData.association = association;
      delete updateData.associationId;
    }

    // Prevent changing tournament type after creation if matches exist
    if (updateTournamentDto.type && updateTournamentDto.type !== tournament.type) {
      // Add check for existing matches if needed
      // const hasMatches = await this.hasMatches(id);
      // if (hasMatches) {
      //   throw new BadRequestException('Cannot change tournament type after matches have been created');
      // }
    }

    await this.tournamentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tournamentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: TournamentStatus): Promise<Tournament> {
    const tournament = await this.findOne(id);
    
    // Add validation for status transitions if needed
    // Example: Can't move from 'completed' to 'in_progress'
    
    tournament.status = status;
    return this.tournamentRepository.save(tournament);
  }

  // Helper method to check if a tournament has any matches
  private async hasMatches(tournamentId: string): Promise<boolean> {
    const result = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoin('tournament.matches', 'match')
      .where('tournament.id = :id', { id: tournamentId })
      .andWhere('match.id IS NOT NULL')
      .getCount();

    return result > 0;
  }
}
