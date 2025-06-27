import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssigmentStatus } from 'src/enums/assigment-status.enum';

export class ReviewAssignmentDto {
  @IsEnum(['reviewed', 'rejected'])
  @ApiProperty({ enum: AssigmentStatus, default: AssigmentStatus.REJECTED })
  status: AssigmentStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'feedback' })
  feedback?: string;
}
