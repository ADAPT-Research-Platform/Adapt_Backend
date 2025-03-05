import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import {Chapter} from "./chapter";

@Entity()
export class Progress {
    @PrimaryColumn({ type: 'int' })
    userId!: number;

    @PrimaryColumn({ type: 'int' })
    chapterId!: number;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @Column({ type: 'float', nullable: false })
    value!: number;

    @ManyToOne(() => Chapter, (chapter) => chapter.answers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterId' })
    chapter!: Chapter;
}
