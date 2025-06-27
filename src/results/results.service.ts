import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
  ) {}

  async getResultsForStudent(studentId: number) {
    return this.assignmentRepo.find({
      where: { student: { id: studentId } },
      relations: ['module'],
      order: { submittedAt: 'DESC' },
    });
  }
}
