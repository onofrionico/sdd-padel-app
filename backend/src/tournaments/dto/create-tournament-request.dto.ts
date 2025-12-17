import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsBoolean, IsNumber, IsOptional, IsObject, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TournamentStatus, TournamentType } from '../entities/tournament.entity';

class TournamentSettingsDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxTeams?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minTeams?: number;

  @ApiProperty()
  @IsNumber()
  teamSize: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  categoryRange?: {
    min: number;
    max: number;
  };

  @ApiProperty()
  @IsObject()
  pointsDistribution: Record<string, number>;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  tiebreakers: string[];
}

export class CreateTournamentRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ enum: TournamentStatus, default: TournamentStatus.UPCOMING })
  @IsEnum(TournamentStatus)
  status: TournamentStatus = TournamentStatus.UPCOMING;

  @ApiProperty({ enum: TournamentType })
  @IsEnum(TournamentType)
  type: TournamentType;

  @ApiProperty({ type: TournamentSettingsDto })
  @ValidateNested()
  @Type(() => TournamentSettingsDto)
  settings: TournamentSettingsDto;

  @ApiProperty({ default: false })
  @IsBoolean()
  isPublic: boolean = false;

  @ApiProperty()
  @IsUUID()
  associationId: string;
}
