import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('friend_requests')
export class FriendRequest extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne( () => User, user => user.id, {eager: true, cascade: true})
    user: User;

    @ManyToOne(() => User, user => user.id, {eager: true, cascade: true})
    requested: User;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(user: User, requester: User) {
        
        super();
        this.user = user;
        this.requested = requester;
    }
}