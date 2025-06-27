import { Injectable, Module, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';
import { error } from 'console';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<ModuleEntity>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(dto: CreateModuleDto) {
    const course = await this.courseRepository.findOne({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = this.moduleRepository.create({
      title: dto.title,
      description: dto.description,
      course,
    });
    return this.moduleRepository.save(module);
  }
  async findCourseModules(id: number) {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
      if (!course) throw new NotFoundException('Bunday kurs topilmadi');
      const courseModules = await this.moduleRepository.find({
        where: { course: { id } },
        relations: ['course'],
      });
      console.log('CourseMOdules', courseModules);

      if (!courseModules) {
        throw new NotFoundException('Bu courseda modullar yoq');
      }
      return courseModules;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getByCourse(courseId: number) {
    return this.moduleRepository.find({
      where: { course: { id: courseId } },
      relations: ['course'],
    });
  }

  async update(id: number, dto: UpdateModuleDto) {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module) throw new NotFoundException('Module not found');

    Object.assign(module, dto);
    return this.moduleRepository.save(module);
  }

  async remove(id: number) {
    const result = await this.moduleRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Module not found');
    return;
  }
}
