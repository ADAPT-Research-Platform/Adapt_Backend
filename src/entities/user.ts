import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';

import { UserType } from '../enums/enum';
import { Mood } from './mood';
import { Answer } from './answer';
import { Track } from './track';

@Entity()
export class User {
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

    @Column({ nullable: false, unique: true, length: 20 })
    username!: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.CLIENT })
    role!: UserType;

    @Column({ nullable: false })
    hashPassword!: string;

    @Column({ nullable: false })
    salt!: string;

    @OneToMany(() => Mood, (mood) => mood.user, { cascade: true })
    moods!: Mood[];

    @OneToMany(() => Answer, (answer) => answer.user)
    answers!: Answer[];

    @OneToMany(() => Track, (track) => track.user)
    tracks!: Track[];
  
    setPassword(password: string) {
        this.salt = bcrypt.genSaltSync(12);
        this.hashPassword = bcrypt.hashSync(password, this.salt);
    }

    verifyPassword(password: string) {
        const hash = bcrypt.hashSync(password, this.salt);
        return hash === this.hashPassword;
    }
}