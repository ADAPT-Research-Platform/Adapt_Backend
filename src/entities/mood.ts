import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class Mood {
  @PrimaryColumn({ type: 'int' })
  userId!: number;

  @PrimaryColumn({ type: 'date' })
  createdDate!: Date; // Composite primary key (auto-generated from createdAt)

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt!: Date; // Timestamp of entry creation

  @Column({ type: 'int', nullable: false })
  feeling!: number; // User's feeling score (1-5)

  @Column({ type: 'int', nullable: false })
  motivation!: number; // User's motivation score (1-5)

  @ManyToOne(() => User, (user) => user.moods, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
