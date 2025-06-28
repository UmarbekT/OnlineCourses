import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { ApiProperty } from '@nestjs/swagger';
import { userRole } from 'src/enums/user-role.enum';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Result } from 'src/results/entities/result.entity';
import { Exclude } from 'class-transformer';

export type UserRole = 'student' | 'admin';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID raqami' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @Column()
  username: string;

  @ApiProperty({ example: 'ali@gmail.com', description: 'Email (unikal)' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashed-password', description: 'Hashlangan parol' })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    example: 'student',
    description: 'Foydalanuvchi roli: student yoki admin',
  })
  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.STUDENT,
  })
  role: UserRole;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Result, (result) => result.student)
  results: Result[];
}
