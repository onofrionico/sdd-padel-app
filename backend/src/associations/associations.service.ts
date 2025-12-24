import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Association } from './entities/association.entity';
import { AssociationMembership } from './entities/association-membership.entity';
import { User } from '../users/entities/user.entity';

export interface CreateAssociationDto {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
  pointsByRound?: Record<string, number>;
}

export interface UpdateAssociationDto extends Partial<CreateAssociationDto> {}

export interface CreateMembershipDto {
  userId: string;
  role: 'admin' | 'organizer' | 'member';
  category?: number;
}

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private readonly associationRepository: Repository<Association>,
    @InjectRepository(AssociationMembership)
    private readonly membershipRepository: Repository<AssociationMembership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAssociationDto): Promise<Association> {
    const association = this.associationRepository.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });

    return this.associationRepository.save(association);
  }

  async findAll(): Promise<Association[]> {
    return this.associationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationRepository.findOne({
      where: { id },
    });

    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }

    return association;
  }

  async update(id: string, dto: UpdateAssociationDto): Promise<Association> {
    await this.findOne(id);
    await this.associationRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.associationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
  }

  async addMember(
    associationId: string,
    dto: CreateMembershipDto,
  ): Promise<AssociationMembership> {
    await this.findOne(associationId);

    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    if (dto.category !== undefined) {
      if (!Number.isInteger(dto.category) || dto.category < 1 || dto.category > 8) {
        throw new BadRequestException('Category must be an integer between 1 and 8');
      }
    }

    const existing = await this.membershipRepository.findOne({
      where: {
        associationId,
        userId: dto.userId,
      },
    });

    if (existing) {
      throw new BadRequestException('User is already a member of this association');
    }

    const membership = this.membershipRepository.create({
      associationId,
      userId: dto.userId,
      role: dto.role,
      category: dto.category,
      points: 0,
    });

    return this.membershipRepository.save(membership);
  }

  async removeMember(associationId: string, userId: string): Promise<void> {
    await this.findOne(associationId);

    const result = await this.membershipRepository.delete({ associationId, userId });
    if (!result.affected) {
      throw new NotFoundException('Membership not found');
    }
  }

  async setMemberCategory(
    associationId: string,
    userId: string,
    category: number,
  ): Promise<AssociationMembership> {
    if (!Number.isInteger(category) || category < 1 || category > 8) {
      throw new BadRequestException('Category must be an integer between 1 and 8');
    }

    const membership = await this.membershipRepository.findOne({
      where: { associationId, userId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    membership.category = category;
    return this.membershipRepository.save(membership);
  }

  async getMemberCategory(
    associationId: string,
    userId: string,
  ): Promise<{ category: number | null }> {
    const membership = await this.membershipRepository.findOne({
      where: { associationId, userId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return { category: membership.category ?? null };
  }

  async getMembership(
    associationId: string,
    userId: string,
  ): Promise<AssociationMembership> {
    const membership = await this.membershipRepository.findOne({
      where: { associationId, userId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }
}
