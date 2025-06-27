import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeacherDto {
  @ApiProperty({ example: 2, description: 'Teacher ID' })
  @IsNumber()
  teacherId: number;
}
