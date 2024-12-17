import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Unique,
} from 'typeorm';

import { User } from './user';

@Entity()
@Unique(['user', 'date']) // Ensure one entry per user per day
export class Mood {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, (user) => user.moods, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    @Column({ type: 'int', nullable: false })
    feeling!: number; // User's feeling score (1-5)

    @Column({ type: 'int', nullable: false })
    motivation!: number; // User's motivation score (1-5)

    @Column({ type: 'date', nullable: false })
    date!: Date; // Date of the mood entry (e.g., YYYY-MM-DD)

    @CreateDateColumn({ nullable: false })
    createdAt!: Date; // Timestamp of entry creation
}
