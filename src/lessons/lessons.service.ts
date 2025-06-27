import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Module } from '../modules/entities/module.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,
  ) {}

  async create(dto: CreateLessonDto) {
    const module = await this.moduleRepo.findOne({
      where: { id: dto.moduleId },
    });
    if (!module) throw new NotFoundException('Module not found');
    const lesson = this.lessonRepo.create({
      title: dto.title,
      content: dto.content,
      module,
    });
    return this.lessonRepo.save(lesson);
  }

  async getByModule(moduleId: number) {
    return this.lessonRepo.find({ where: { module: { id: moduleId } } });
  }

  async update(id: number, dto: UpdateLessonDto) {
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    Object.assign(lesson, dto);
    return this.lessonRepo.save(lesson);
  }

  async remove(id: number) {
    const res = await this.lessonRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Lesson not found');
  }
}
