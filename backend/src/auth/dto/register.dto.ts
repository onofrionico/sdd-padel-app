import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { Gender } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123!',
    description: 'The password for the user account',
    required: true,
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'The gender of the user',
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The date of birth of the user (YYYY-MM-DD)',
    required: false,
  })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    enum: ['right', 'left', 'ambidextrous'],
    example: 'right',
    description: 'The playing hand preference of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  playingHand?: 'right' | 'left' | 'ambidextrous';

  @ApiProperty({
    enum: ['defensive', 'offensive', 'all_around'],
    example: 'all_around',
    description: 'The playing style of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  playingStyle?: 'defensive' | 'offensive' | 'all_around';
}
