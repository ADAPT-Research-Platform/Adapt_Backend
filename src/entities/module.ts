import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';

import { Chapter } from './chapter';

@Entity()
export class Module {
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

    @OneToMany(() => Chapter, (chapter) => chapter.module)
    chapters!: Chapter[];
}
