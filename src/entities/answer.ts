import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from './user';
import { Chapter } from './chapter';

@Entity()
export class Answer {
  @PrimaryColumn({ type: 'int' })
  userId!: number;

  @PrimaryColumn({ type: 'int' })
  chapterId!: number;

  @PrimaryColumn({ type: 'timestamp' })
  createdAt!: Date;

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
