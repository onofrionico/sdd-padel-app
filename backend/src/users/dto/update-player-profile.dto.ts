import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePlayerProfileDto {
  @ApiProperty({
    required: false,
    enum: ['right', 'left', 'ambidextrous'],
  })
  @IsOptional()
  @IsIn(['right', 'left', 'ambidextrous'])
  playingHand?: 'right' | 'left' | 'ambidextrous';

  @ApiProperty({
    required: false,
    enum: ['defensive', 'offensive', 'all_around'],
  })
  @IsOptional()
  @IsIn(['defensive', 'offensive', 'all_around'])
  playingStyle?: 'defensive' | 'offensive' | 'all_around';

  @ApiProperty({
    required: false,
    description: 'Optional URL of the profile picture',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePicture?: string;
}
