import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Response } from 'express';
import { AssignTeacherDto } from './dto/assign-teacher.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create')
  async create(@Body() dto: CreateCourseDto, @Res() res: Response) {
    const course = await this.coursesService.create(dto);
    return res.status(201).json({ status: 'success', data: course });
  }

  @Get('get-all')
  async findAll(@Res() res: Response) {
    const courses = await this.coursesService.findAll();
    return res.status(200).json({ status: 'success', data: courses });
  }

  @Get('get-one/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const course = await this.coursesService.findOne(+id);
    return res.status(200).json({ status: 'success', data: course });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Res() res: Response,
  ) {
    const course = await this.coursesService.update(+id, dto);
    return res.status(200).json({ status: 'success', data: course });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.coursesService.remove(+id);
    return res
      .status(200)
      .json({ status: 'success', message: 'Course deleted successfully' });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/assign-teacher')
  async assignTeacher(
    @Param('id') courseId: string,
    @Body() assignTeacherDto: AssignTeacherDto,
    @Res() res: Response,
  ) {
    const result = await this.coursesService.assignTeacher(
      +courseId,
      assignTeacherDto.teacherId,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Teacher biriktirildi', data: result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  @Get(':id/students')
  async getCourseStudents(@Param('id') courseId: string, @Res() res: Response) {
    const students = await this.coursesService.getEnrolledStudents(+courseId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Studentlar ro‘yxati', data: students });
  }
}
