import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Birbalo' })
  content: string;
}
