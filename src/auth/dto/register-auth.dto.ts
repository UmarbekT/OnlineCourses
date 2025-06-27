import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { userRole } from 'src/enums/user-role.enum';

export class RegisterAuthDto extends CreateUserDto {
  @IsEmail()
  @ApiProperty({ default: 'jhonakani@gmail.com' })
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ default: 'jhonaka' })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ default: 'secure123' })
  password: string;
  @IsEnum(userRole)
  @ApiProperty({ enum: userRole })
  role: string;
}
