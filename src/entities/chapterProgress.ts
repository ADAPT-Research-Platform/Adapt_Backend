import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';

import { Chapter } from './chapter';
import { ModuleProgress } from './moduleProgress';

@Entity()
@Unique(['moduleProgress', 'chapter'])
export class ChapterProgress {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => ModuleProgress, (moduleProgress) => moduleProgress.chapterProgress, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    moduleProgress!: ModuleProgress;

    @ManyToOne(() => Chapter, { nullable: false, onDelete: 'CASCADE' })
    chapter!: Chapter;

    @Column({ type: 'float', default: 0 }) // Progress percentage for the chapter
    progressPercentage!: number;

    @Column({ type: 'enum', enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' })
    completionStatus!: 'Not Started' | 'In Progress' | 'Completed';

    @Column({ type: 'timestamp', nullable: true }) // Completion date
    completedAt!: Date | null;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;
}
