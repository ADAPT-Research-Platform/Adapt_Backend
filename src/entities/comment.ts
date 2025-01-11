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
import {Section} from './section';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

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
    parentId!: Comment | null;

    @OneToMany(() => Comment, (comment) => comment.parentId)
    replies!: Comment[];

    @ManyToOne(() => Section, (section) => section.comments, { nullable: false, onDelete: 'CASCADE' })
    section!: Section;
}
