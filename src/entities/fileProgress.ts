import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
  
  import { File } from './file';
  import { ChapterProgress } from './chapterProgress';
  
  @Entity()
  @Unique(['chapterProgress', 'file']) // Ensures unique progress entry for each file in a chapter
  export class FileProgress {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @ManyToOne(() => ChapterProgress, (chapterProgress) => chapterProgress.fileProgress, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    chapterProgress!: ChapterProgress;
  
    @ManyToOne(() => File, { nullable: false, onDelete: 'CASCADE' })
    file!: File;
  
    @Column({ type: 'boolean', default: false }) // Indicates if the file is completed
    isCompleted!: boolean;
  
    @Column({ type: 'timestamp', nullable: true }) // Timestamp for file completion
    completedAt!: Date | null;
  
    @CreateDateColumn({ nullable: false })
    createdAt!: Date;
  
    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;
  }
  