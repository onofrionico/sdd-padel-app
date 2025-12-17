import { PartialType } from '@nestjs/swagger';
import { CreateAssociationRequestDto } from './create-association-request.dto';

export class UpdateAssociationRequestDto extends PartialType(
  CreateAssociationRequestDto,
) {}
