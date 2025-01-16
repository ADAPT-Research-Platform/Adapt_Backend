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

import { Chapter } from './chapter';
import { Comment } from './comment';
import { Answer } from "./answer";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @ManyToOne(() => Chapter, (chapter) => chapter.sections, { onDelete: 'CASCADE' })
  chapter!: Chapter;

  @OneToMany(() => Comment, (comment) => comment.section)
  comments!: Comment[];

  @OneToMany(() => Answer, (answer) => answer.section)
  answers!: Answer[];
}
