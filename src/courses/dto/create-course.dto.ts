import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CourseLevel } from 'src/enums/course-level.enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'Matematika' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    example: 'Arifmatik formulalar va shunga oxshaganlarni orgatamiz',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 225,
  })
  price?: boolean;
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Math',
  })
  category?: string;
  @IsOptional()
  @IsEnum(CourseLevel)
  level: CourseLevel.BEGINNER;
}
