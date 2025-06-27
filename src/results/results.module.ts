import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { Result } from './entities/result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { AssignmentsModule } from 'src/assignments/assignments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Assignment]), AssignmentsModule],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
