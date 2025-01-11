import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Module } from './module';
import { Section } from './section';

@Entity()
export class Chapter {
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

  @Column({ nullable: false, length: 255 })
  title!: string;

  @ManyToOne(() => Module, (module) => module.chapters, { onDelete: 'CASCADE' })
  module!: Module;

  @OneToMany(() => Section, (section) => section.chapter)
  sections!: Section[];
}
