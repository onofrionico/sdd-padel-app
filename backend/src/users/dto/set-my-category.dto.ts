import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SetMyCategoryDto {
  @ApiProperty({
    description: 'Category (1-8)',
    minimum: 1,
    maximum: 8,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(8)
  category: number;
}
