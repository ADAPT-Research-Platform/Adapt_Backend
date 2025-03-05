import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany, OneToOne,
} from 'typeorm';

import { Comment } from './comment';
import { Answer } from './answer';
import { Module } from './module';
import { Progress } from "./progress";

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  moduleId!: number;

  @Column({ type: 'int' })
  index!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: false })
  folderUrl!: string;

  @Column({ nullable: false, length: 255 })
  title!: string;

  @Column({ default: true })
  isExercise!: boolean;

  @ManyToOne(() => Module, (module) => module.chapters, { onDelete: 'CASCADE' })
  module!: Module;

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments!: Comment[];

  @OneToMany(() => Answer, (answer) => answer.chapter)
  answers!: Answer[];

  @OneToOne(() => Progress, (progress) => progress.chapter)
  progress!: Progress;
}
