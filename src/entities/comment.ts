import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
  
  import { User } from './user';
  import { Chapter } from './chapter';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn({ nullable: false })
    createdAt!: Date;
  
    @Column({ type: 'text', nullable: false })
    text!: string;

    @Column({type: 'int' })
    chapterUserId!: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterUserId' })
    chapterUser!: User;
  
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentUserId' })
    commentUser!: User;
  
    @ManyToOne(() => Comment, (comment) => comment.replies, {
      nullable: true,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'parentId' })
    parent!: Comment | null;
  
    @OneToMany(() => Comment, (comment) => comment.parent, { cascade: true })
    replies!: Comment[];
  
    @ManyToOne(() => Chapter, (chapter) => chapter.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterId' })
    chapter!: Chapter;
  }
  