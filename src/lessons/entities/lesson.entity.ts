import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Module } from '../../modules/entities/module.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, length: 1000 })
  content: string;

  @ManyToOne(() => Module, (module) => module.lessons, { onDelete: 'CASCADE' })
  module: Module;
}
