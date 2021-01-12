import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDTO } from "../dtos/user.dto";
import { User } from "./user.entity";

@Entity('friend_requests')
export class FriendRequest extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne( () => User, user => user.id)
    user: UserDTO;

    @ManyToOne(() => User, user => user.id)
    requester: UserDTO;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(user: UserDTO, requester: UserDTO) {
        
        super();
        this.user = user;
        this.requester = requester;
    }
}