import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Module } from './module';
import { Exercise } from './exercise';
import { Comment } from './comment';
import { File } from './file';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ nullable: false, length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ nullable: false })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  fileUrl!: string | null;

  @ManyToOne(() => Module, (module) => module.chapters, { onDelete: 'CASCADE' })
  module!: Module;

  @OneToMany(() => Exercise, (exercise) => exercise.chapter)
  exercises!: Exercise[];

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments!: Comment[];

  @OneToMany(() => File, (file) => file.chapter, { cascade: true })
  files!: File[];
}
