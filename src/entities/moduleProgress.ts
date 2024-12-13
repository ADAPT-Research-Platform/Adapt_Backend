import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Unique,
    OneToMany,
} from 'typeorm';

import { User } from './user';
import { Module } from './module';
import { ChapterProgress } from './chapterProgress';

@Entity()
@Unique(['user', 'module'])
export class ModuleProgress {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Module, { nullable: false, onDelete: 'CASCADE' })
    module!: Module;

    @Column({ type: 'float', default: 0 }) // Overall progress (0–100%)
    progressPercentage!: number;

    @Column({ type: 'enum', enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' })
    completionStatus!: 'Not Started' | 'In Progress' | 'Completed';

    @Column({ type: 'timestamp', nullable: true }) // Completion date
    completedAt!: Date | null;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @OneToMany(() => ChapterProgress, (chapterProgress) => chapterProgress.moduleProgress, {
        cascade: true,
    })
    chapterProgress!: ChapterProgress[];
}
