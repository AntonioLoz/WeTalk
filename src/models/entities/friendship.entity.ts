import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { FriendshipStatus } from "../enums/friendship_status"
import { PersonalMessage } from "./personal_message.entity";

@Entity('friendships')
export class Friendship extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: FriendshipStatus ,default: FriendshipStatus.pending, nullable: false })
    status: FriendshipStatus;

    @ManyToMany( () => User, (user: User) => user.friendships, { eager: true })
    @JoinTable()
    users: Array<User>;

    @OneToMany( () => PersonalMessage, message => message.friendship, { eager: true })
    messages: Array<PersonalMessage>;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(users: Array<User>) {
        
        super();
        this.users = users
    }
}