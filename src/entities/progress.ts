import {
    Entity,
    Column,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Progress {
    @PrimaryColumn({ type: 'int' })
    userId!: number;

    @PrimaryColumn({ type: 'int' })
    moduleId!: number;

    @PrimaryColumn({ type: 'int' })
    chapterId!: number;

    @PrimaryColumn({ type: 'int' })
    sectionId!: number;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @Column({ type: 'float', nullable: false })
    value!: number;
}
