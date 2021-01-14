import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('friends')
export class Friendship extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne( () => User, user => user.id, {eager: true, cascade: true})
    @JoinColumn()
    user: User;

    @ManyToOne(() => User, user => user.id, {eager: true, cascade: true})
    @JoinColumn()
    friend: User;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(user: User, friend: User) {
        
        super();
        this.user = user;
        this.friend = friend;
    }
}