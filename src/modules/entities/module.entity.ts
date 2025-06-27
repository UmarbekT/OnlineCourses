import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, length: 500 })
  description: string;

  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'CASCADE' })
  course: Course;
  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];
  @OneToMany(() => Assignment, (assignment) => assignment.module)
  assignments: Assignment[];
}
