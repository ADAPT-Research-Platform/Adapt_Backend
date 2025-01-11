import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique, ManyToOne,
} from 'typeorm';
import { User } from "./user";

@Entity()
@Unique(['user', 'createdAt']) // Ensure one entry per user per day
export class Mood {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date; // Timestamp of entry creation

    @Column({ type: 'int', nullable: false })
    feeling!: number; // User's feeling score (1-5)

    @Column({ type: 'int', nullable: false })
    motivation!: number; // User's motivation score (1-5)

    @ManyToOne(() => User, (user) => user.moods, { nullable: false, onDelete: 'CASCADE' })
    user!: User;
}
