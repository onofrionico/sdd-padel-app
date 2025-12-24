import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { Season } from './entities/season.entity';

export interface CreateSeasonParams {
  associationId: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class SeasonsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Association)
    private readonly associationRepository: Repository<Association>,
  ) {}

  async createSeason(params: CreateSeasonParams): Promise<Season> {
    if (!(params.startDate instanceof Date) || Number.isNaN(params.startDate.getTime())) {
      throw new BadRequestException('Invalid startDate');
    }

    if (!(params.endDate instanceof Date) || Number.isNaN(params.endDate.getTime())) {
      throw new BadRequestException('Invalid endDate');
    }

    if (params.startDate.getTime() >= params.endDate.getTime()) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const association = await this.associationRepository.findOne({ where: { id: params.associationId } });
    if (!association) {
      throw new NotFoundException('Association not found');
    }

    const overlapCount = await this.seasonRepository
      .createQueryBuilder('s')
      .where('s.associationId = :associationId', { associationId: params.associationId })
      .andWhere('s.startDate <= :endDate', { endDate: params.endDate })
      .andWhere('s.endDate >= :startDate', { startDate: params.startDate })
      .getCount();

    if (overlapCount > 0) {
      throw new BadRequestException('Season dates overlap with an existing season');
    }

    const season = this.seasonRepository.create({
      associationId: params.associationId,
      name: params.name,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    return this.seasonRepository.save(season);
  }

  async listSeasons(associationId: string): Promise<Season[]> {
    return this.seasonRepository.find({
      where: { associationId },
      order: { startDate: 'DESC' },
    });
  }

  async getSeasonById(params: { associationId: string; seasonId: string }): Promise<Season> {
    const season = await this.seasonRepository.findOne({
      where: { id: params.seasonId, associationId: params.associationId },
    });

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    return season;
  }
}
