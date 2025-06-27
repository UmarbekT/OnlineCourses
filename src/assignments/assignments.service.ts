import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Module } from 'src/modules/entities/module.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ReviewAssignmentDto } from './dto/review-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(Module)
    private moduleRepo: Repository<Module>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async submitAssignment(
    moduleId: number,
    studentId: number,
    dto: CreateAssignmentDto,
  ) {
    const module = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Modul topilmadi');

    const student = await this.userRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Foydalanuvchi topilmadi');

    const assignment = this.assignmentRepo.create({
      module,
      student,
      content: dto.content,
    });

    return this.assignmentRepo.save(assignment);
  }

  async getAssignmentsByModule(moduleId: number) {
    return this.assignmentRepo.find({
      where: { module: { id: moduleId } },
      relations: ['student'],
      order: { submittedAt: 'DESC' },
    });
  }

  async reviewAssignment(
    assignmentId: number,
    reviewerId: number,
    dto: ReviewAssignmentDto,
  ) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['module', 'module.course'],
    });
    if (!assignment) throw new NotFoundException('Assignment topilmadi');

    const reviewer = await this.userRepo.findOne({ where: { id: reviewerId } });
    if (!reviewer) throw new NotFoundException('Tekshiruvchi topilmadi');

    if (!['teacher', 'admin'].includes(reviewer.role)) {
      throw new ForbiddenException('Sizga ruxsat yo‘q');
    }

    assignment.status = dto.status;
    assignment.feedback = dto.feedback || '';
    assignment.reviewedBy = reviewer;

    return this.assignmentRepo.save(assignment);
  }
}
