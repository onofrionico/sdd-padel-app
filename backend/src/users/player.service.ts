import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationsService } from '../associations/associations.service';
import { User } from './entities/user.entity';
import { RegisterPlayerDto } from './dto/register-player.dto';
import { UpdatePlayerProfileDto } from './dto/update-player-profile.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly associationsService: AssociationsService,
  ) {}

  async registerInAssociation(userId: string, dto: RegisterPlayerDto) {
    return this.associationsService.addMember(dto.associationId, {
      userId,
      role: 'member',
      category: dto.category,
    });
  }

  async setCategory(userId: string, associationId: string, category: number) {
    return this.associationsService.setMemberCategory(associationId, userId, category);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        associationMemberships: {
          association: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdatePlayerProfileDto): Promise<User> {
    await this.usersRepository.update(userId, {
      playingHand: dto.playingHand,
      playingStyle: dto.playingStyle,
      profilePicture: dto.profilePicture,
    });

    return this.getProfile(userId);
  }
}
