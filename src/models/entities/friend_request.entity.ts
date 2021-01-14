import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDTO } from "../dtos/user.dto";
import { User } from "./user.entity";

@Entity('friend_requests')
export class FriendRequest extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne( () => User, user => user.id)
    user: User;

    @ManyToOne(() => User, user => user.id)
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