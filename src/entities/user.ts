import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';

import { UserType } from '../enums/enum';
import { Mood } from './mood';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    @Column({ nullable: false, unique: true, length: 20 })
    username!: string;

    @Column({ nullable: false, unique: true, length: 255 })
    email!: string;
    
    @Column({ nullable: false })
    hashPassword!: string;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.USER,
    })
    role!: UserType;

    @Column({ nullable: false })
    salt!: string;
    
    @OneToMany(() => Mood, (mood) => mood.user, { cascade: true })
    moods!: Mood[];
    
    setPassword(password: string) {
        this.salt = bcrypt.genSaltSync(12);
        this.hashPassword = bcrypt.hashSync(password, this.salt);
    }

    verifyPassword(password: string) {
        const hash = bcrypt.hashSync(password, this.salt);
        return hash === this.hashPassword;
    }
}