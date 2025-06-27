import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ default: false })
  isReviewed: boolean;

  @OneToOne(() => Assignment, (assignment) => assignment.result)
  assignment: Assignment;

  @ManyToOne(() => User, (user) => user.results)
  student: User;
}
