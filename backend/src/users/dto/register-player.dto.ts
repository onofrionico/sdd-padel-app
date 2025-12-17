import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class RegisterPlayerDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Association ID where the user will register as a player',
  })
  @IsUUID()
  associationId: string;

  @ApiProperty({
    required: false,
    description: 'Optional initial category for the association (1-8)',
    minimum: 1,
    maximum: 8,
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  category?: number;
}
