import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Check,
  } from 'typeorm';
  
  import { Chapter } from './chapter';
  import { ModuleProgress } from './moduleProgress';
  import { FileProgress } from './fileProgress';
  
  @Entity()
  @Unique(['chapter', 'moduleProgress'])
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
  
    @OneToMany(() => FileProgress, (fileProgress) => fileProgress.chapterProgress, { cascade: true })
    fileProgress!: FileProgress[];
  
    @Column({ type: 'float', default: 0 }) // Percentage of chapter progress
    @Check('progressPercentage >= 0 AND progressPercentage <= 100')
    progressPercentage!: number;
  
    @Column({ type: 'enum', enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' })
    completionStatus!: 'Not Started' | 'In Progress' | 'Completed';
  
    @Column({ type: 'timestamp', nullable: true }) // Completion timestamp
    completedAt!: Date | null;
  
    @CreateDateColumn({ nullable: false })
    createdAt!: Date;
  
    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;
  
    /**
     * Updates the progress percentage and completion status based on file progress.
     */
    calculateProgress() {
      const totalFiles = this.fileProgress.length;
  
      if (totalFiles === 0) {
        this.progressPercentage = 0;
        this.completionStatus = 'Not Started';
        this.completedAt = null;
        return;
      }
  
      const completedFiles = this.fileProgress.filter((fp) => fp.isCompleted).length;
  
      // Update progress percentage
      this.progressPercentage = (completedFiles / totalFiles) * 100;
  
      // Update completion status
      if (completedFiles === totalFiles) {
        this.completionStatus = 'Completed';
        this.completedAt = this.completedAt || new Date();
      } else if (completedFiles > 0) {
        this.completionStatus = 'In Progress';
        this.completedAt = null;
      } else {
        this.completionStatus = 'Not Started';
        this.completedAt = null;
      }
    }
  }
  