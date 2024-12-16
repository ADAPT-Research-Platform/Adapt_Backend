import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Chapter } from './chapter';
import { Exercise } from './exercise';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  filePath!: string; // The path to the uploaded file

  @CreateDateColumn()
  uploadedAt!: Date;

  @ManyToOne(() => Chapter, (chapter) => chapter.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  chapter!: Chapter | null; // The associated chapter, if any

  @ManyToOne(() => Exercise, (exercise) => exercise.files, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  exercise!: Exercise | null; // The associated exercise, if any
}
