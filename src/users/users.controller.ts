import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    return res.status(200).json({ status: 'success', data: req.user as User });
  }

  @ApiOperation({ summary: 'Hamma userlani olish (admin only)' })
  @Get('/find-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Req() req: Request & { user: User }, @Res() res: Response) {
    const users = await this.usersService.findAll();
    if (!users) {
      return res.status(404).json({
        status: 'failed',
        message: 'Studentlar Malumotlar bazasida topilmadi',
      });
    }
    return res.status(200).json({ status: 'success', data: users });
  }

  @ApiOperation({ summary: 'bitta userni olish (admin only)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/find-one/:id')
  async findOne(
    @Req() req: Request & { user: User },
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'failed', message: `${id}'lik student topilmadi` });
    }
    return res.status(200).json({ status: 'success', data: user });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student', 'admin')
  @Patch('/update-profile')
  async updateProfile(
    @Res() res: Response,
    @Req() req: Request & { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('req.user:', req.user);
    const updatedUser = await this.usersService.update(
      req.user?.id,
      updateUserDto,
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: 'failed',
        message: `${req.user.id}'lik user topilmadi`,
      });
    }
    return res.status(200).json({ status: 'success', data: updatedUser });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteUser(
    @Req() req: Request & { user: User },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.usersService.remove(+id);
    return res
      .status(200)
      .json({ status: 'success', message: `${id}'lik user o'chirildi` });
  }
}
