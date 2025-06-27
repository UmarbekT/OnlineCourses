import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Module } from 'src/modules/entities/module.entity';
import { User } from 'src/users/entities/user.entity';
import { Result } from 'src/results/entities/result.entity';
import { AssigmentStatus } from 'src/enums/assigment-status.enum';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Module, (module) => module.assignments)
  module: Module;

  @ManyToOne(() => User)
  student: User;

  @Column()
  content: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ enum: AssigmentStatus, default: AssigmentStatus.SUBMITTED })
  status: AssigmentStatus;
  @Column({ nullable: true })
  feedback: string;

  @ManyToOne(() => User, { nullable: true })
  reviewedBy: User;

  @UpdateDateColumn()
  reviewedAt: Date;
  @OneToOne(() => Result, (result) => result.assignment)
  result: Result;
}
