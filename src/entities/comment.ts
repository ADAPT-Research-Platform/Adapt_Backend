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
  import { Section } from './section';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn({ nullable: false })
    createdAt!: Date;
  
    @Column({ type: 'text', nullable: false })
    text!: string;
  
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sectionUserId' })
    sectionUser!: User;
  
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
  
    @ManyToOne(() => Section, (section) => section.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sectionId' })
    section!: Section;
  }
  