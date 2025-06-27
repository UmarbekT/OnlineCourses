import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Updated title' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Updated content' })
  content?: string;
}
