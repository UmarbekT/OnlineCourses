import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from 'src/modules/modules.module';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { User } from 'src/users/entities/user.entity';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, ModuleEntity, User]),
    ModulesModule,
    EnrollmentsModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
