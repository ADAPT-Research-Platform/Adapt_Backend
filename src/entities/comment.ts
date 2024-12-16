import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from './user';
import { Chapter } from './chapter';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    @Column({ type: 'text', nullable: false })
    content!: string;

    @ManyToOne(() => User, (user) => user, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
    parentComment!: Comment | null;

    @OneToMany(() => Comment, (comment) => comment.parentComment)
    replies!: Comment[];

    @ManyToOne(() => Chapter, (chapter) => chapter.comments, { nullable: false, onDelete: 'CASCADE' })
    chapter!: Chapter;
}
