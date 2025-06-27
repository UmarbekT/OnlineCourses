import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { userRole } from 'src/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      if (!users) {
        throw new NotFoundException('Userlar Malumotlar bazasida topilmadi');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async create(registerUserDto: RegisterAuthDto): Promise<User> {
    try {
      console.log('Creating user:', registerUserDto);
      const existingUser = await this.findByEmail(registerUserDto.email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
      const user = this.usersRepository.create({
        username: registerUserDto.username,
        email: registerUserDto.email,
        password: hashedPassword,
        role: registerUserDto.role === 'admin' ? 'admin' : 'student',
      });

      const savedUser = await this.usersRepository.save(user);
      console.log('✅ CREATED USER:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('❌ FULL ERROR:', error);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      return user;
    } catch (error) {
      console.log(`Error fetching user by email: ${email}`, error);

      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (updateUserDto.email) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email already exists');
        }
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatePayload = { ...updateUserDto };

      if (typeof updatePayload.role === 'undefined') {
        delete updatePayload.role;
      } else {
        updatePayload.role = updatePayload.role as userRole;
      }

      await this.usersRepository.update(id, updatePayload as any); //any qilishga majbur bo'ldim xato chiqaverdi
      return await this.findOne(id);
    } catch (error) {
      console.error(' Error updating user:', error);
      throw new InternalServerErrorException('Error updating user');
    }
  }
  async remove(id: number): Promise<void> {
    try {
      const result = await this.usersRepository.delete(id);
      console.log(result);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
