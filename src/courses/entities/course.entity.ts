import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Module } from 'src/modules/entities/module.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { CourseLevel } from 'src/enums/course-level.enum';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Matematika', maxLength: 100, minLength: 3 })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Matematikani organing',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 499 })
  @Column({ type: 'numeric' })
  price: number;

  @ApiProperty({ example: 'Math' })
  @Column()
  category: string;

  @ApiProperty({
    example: 'Beginner',
  })
  @Column({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @ApiProperty({
    type: () => User,
    description: 'Kurs oqituvchisi',
  })
  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
