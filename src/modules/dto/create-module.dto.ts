import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: '1', description: 'Course ID' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ example: 'Frontend Basics', description: 'Module title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'HTML, CSS, JavaScript basics', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
