import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { FriendshipStatus } from "../enums/friendship_status"
import { PersonalMessage } from "./personal_message.entity";

@Entity('friendships')
export class Friendship extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: FriendshipStatus ,default: FriendshipStatus.pending, nullable: false })
    status: FriendshipStatus;

    @ManyToOne( () => User, user => user.friendships, { eager: true } )
    sender: User;

    @ManyToOne( ()=> User, user => user.friendships, { eager: true })
    receiver: User;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(sender: User, receiver: User) {
        
        super();
        this.sender = sender;
        this.receiver = receiver;
    }
}