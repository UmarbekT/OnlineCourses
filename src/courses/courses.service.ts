import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from '../users/entities/user.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { userRole } from 'src/enums/user-role.enum';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async create(dto: CreateCourseDto) {
    const exists = await this.courseRepo.findOne({
      where: { name: dto.name },
    });
    if (exists) throw new NotFoundException('Course already exists');

    const courseData = {
      ...dto,
      price: typeof dto.price === 'boolean' ? (dto.price ? 1 : 0) : dto.price,
    };
    const course = this.courseRepo.create(courseData);
    return this.courseRepo.save(course);
  }

  async findAll() {
    return this.courseRepo.find({
      relations: ['teacher'],
    });
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['teacher'],
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async remove(id: number) {
    const result = await this.courseRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Course not found');
  }

  async assignTeacher(courseId: number, teacherId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['teacher'],
    });
    if (!course) throw new NotFoundException('Course not found');

    const teacher = await this.userRepo.findOne({
      where: { id: teacherId, role: userRole.TEACHER as any }, //xato chiqaverdi shu yerdda
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    course.teacher = teacher;
    await this.courseRepo.save(course);

    return { courseId, teacherId };
  }

  async getEnrolledStudents(courseId: number) {
    const enrollments = await this.enrollmentRepo.find({
      where: { course: { id: courseId } },
      relations: ['student'],
    });
    return enrollments.map((e) => ({
      id: e.student.id,
      username: e.student.username,
      email: e.student.email,
    }));
  }
}
