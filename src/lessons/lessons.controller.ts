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
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Response } from 'express';
import { EnrolledGuard } from 'src/shared/guards/entrolled.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Post('create')
  async create(@Body() dto: CreateLessonDto, @Res() res: Response) {
    const lesson = await this.lessonsService.create(dto);
    return res.status(201).json({ status: 'success', data: lesson });
  }
  @UseGuards(JwtAuthGuard, EnrolledGuard)
  @Get('/module/:moduleId')
  async getByModule(@Param('moduleId') moduleId: string, @Res() res: Response) {
    const lessons = await this.lessonsService.getByModule(+moduleId);
    return res.status(200).json({ status: 'success', data: lessons });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
    @Res() res: Response,
  ) {
    const lesson = await this.lessonsService.update(+id, dto);
    return res.status(200).json({ status: 'success', data: lesson });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.lessonsService.remove(+id);
    return res.status(200).json({ message: 'Lesson deleted successfully' });
  }
}
