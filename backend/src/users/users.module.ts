import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { PlayerService } from './player.service';
import { AssociationsModule } from '../associations/associations.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AssociationsModule],
  controllers: [UsersController],
  providers: [UsersService, PlayerService],
  exports: [UsersService],
})
export class UsersModule {}
