import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user';
import { Chapter } from './chapter';

@Entity()
export class Answer {
  @PrimaryColumn({ type: 'int' })
  userId!: number;

  @PrimaryColumn({ type: 'int' })
  chapterId!: number;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'json', nullable: false })
  text!: object;

  @ManyToOne(() => User, (user) => user.answers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Chapter, (chapter) => chapter.answers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapterId' })
  chapter!: Chapter;
}
