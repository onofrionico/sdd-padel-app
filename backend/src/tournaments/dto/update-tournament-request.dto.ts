import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentRequestDto } from './create-tournament-request.dto';

export class UpdateTournamentRequestDto extends PartialType(CreateTournamentRequestDto) {}
