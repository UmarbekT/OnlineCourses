import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './entities/module.entity';
import { Course } from '../courses/entities/course.entity';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { EnrolledGuard } from 'src/shared/guards/entrolled.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity, Course]),
    EnrollmentsModule,
  ],
  controllers: [ModulesController],
  providers: [ModulesService, EnrolledGuard],
  exports: [TypeOrmModule],
})
export class ModulesModule {}
