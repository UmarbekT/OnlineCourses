import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from 'src/modules/modules.module';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Module as ModuleEntitiy } from '../modules/entities/module.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, ModuleEntitiy, Enrollment]),
    ModulesModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
