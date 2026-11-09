import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePlayerProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phoneNumber?: string;

  @ApiProperty({ required: false, enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({ required: false, example: '1990-05-20' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

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
