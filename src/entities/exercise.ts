import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from "typeorm";

import { Chapter } from "./chapter";

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ nullable: false, length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  content!: string | null;

  @Column({ nullable: false })
  order!: number;

  @Column({ type: "enum", enum: ["Easy", "Medium", "Hard"], default: "Medium" })
  difficulty!: "Easy" | "Medium" | "Hard";

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
    fileUrl!: string | null; 

  @ManyToOne(() => Chapter, (chapter) => chapter.exercises, {
    onDelete: "CASCADE",
  })
  chapter!: Chapter;
}
