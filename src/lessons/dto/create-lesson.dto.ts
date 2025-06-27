import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
export class CreateLessonDto {
  @IsNumber()
  @ApiProperty({
    default: 3,
    description: 'Lesson qoymoqchi bolgan modul idsi',
  })
  moduleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Javascript tarixi' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'kop matn' })
  content?: string;
}
