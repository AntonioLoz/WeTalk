import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('friendship')
export class Friendship extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, user => user.id)
    requester: User;

    @ManyToOne( () => User, user => user.id)
    friend: User;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}