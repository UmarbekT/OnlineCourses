import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Response } from 'express';
import { EnrolledGuard } from 'src/shared/guards/entrolled.guard';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create')
  async create(@Body() dto: CreateModuleDto, @Res() res: Response) {
    const module = await this.modulesService.create(dto);
    return res.status(201).json({ status: 'success', data: module });
  }
  @UseGuards(JwtAuthGuard, EnrolledGuard)
  @Get('course/:courseId')
  async getByCourse(@Param('courseId') courseId: string, @Res() res: Response) {
    const modules = await this.modulesService.getByCourse(+courseId);
    return res.status(200).json({ status: 'success', data: modules });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateModuleDto,
    @Res() res: Response,
  ) {
    const module = await this.modulesService.update(+id, dto);
    return res.status(200).json({ status: 'success', data: module });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.modulesService.remove(+id);
    return res.status(200).json({ message: 'Module deleted successfully' });
  }
}
