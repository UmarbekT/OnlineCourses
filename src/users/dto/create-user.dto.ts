import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { userRole } from '../../enums/user-role.enum';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(userRole, {
    message: 'role must be one of the following values: student, admin',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  updated_at?: Date;
}
