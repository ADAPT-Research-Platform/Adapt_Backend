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
  
    @Column({ type: 'float', default: 0 }) // Overall progress percentage (0–100%)
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
  
    /**
     * Calculates the overall progress and completion status based on chapter progress.
     */
    calculateProgress() {
      const totalChapters = this.chapterProgress.length;
  
      if (totalChapters === 0) {
        this.progressPercentage = 0;
        this.completionStatus = 'Not Started';
        this.completedAt = null;
        return;
      }
  
      const completedChapters = this.chapterProgress.filter(
        (cp) => cp.completionStatus === 'Completed'
      ).length;
  
      // Calculate progress percentage
      this.progressPercentage = (completedChapters / totalChapters) * 100;
  
      // Update completion status
      if (completedChapters === totalChapters) {
        this.completionStatus = 'Completed';
        this.completedAt = this.completedAt || new Date();
      } else if (completedChapters > 0) {
        this.completionStatus = 'In Progress';
        this.completedAt = null;
      } else {
        this.completionStatus = 'Not Started';
        this.completedAt = null;
      }
    }
  }
  