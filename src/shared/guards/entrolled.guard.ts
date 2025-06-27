import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EnrolledGuard implements CanActivate {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user: User }>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const courseId = Number(req.params.courseId);
    if (!courseId) {
      throw new ForbiddenException('Course ID is required');
    }

    const enrollment = await this.enrollmentRepo.findOne({
      where: {
        student: { id: user.id },
        course: { id: courseId },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        'Siz bu kursga yozilmagansiz, kirish taqiqlangan',
      );
    }

    return true;
  }
}
