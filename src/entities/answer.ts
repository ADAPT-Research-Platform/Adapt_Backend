import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user';
import { Section } from './section';

@Entity()
@Unique(['userId', 'sectionId']) // Composite unique constraint
export class Answer {
  @PrimaryColumn({ type: 'int' })
  userId!: number;

  @PrimaryColumn({ type: 'int' })
  sectionId!: number;

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

  @ManyToOne(() => Section, (section) => section.answers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section!: Section;
}
