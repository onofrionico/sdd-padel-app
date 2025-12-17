import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreateMembershipRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: ['admin', 'organizer', 'member'] })
  @IsIn(['admin', 'organizer', 'member'])
  role: 'admin' | 'organizer' | 'member';

  @ApiProperty({ required: false, minimum: 1, maximum: 8 })
  @IsInt()
  @Min(1)
  @Max(8)
  @IsOptional()
  category?: number;
}
