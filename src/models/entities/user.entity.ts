import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.entity";
import * as bcrypt  from 'bcrypt'
import { Friend } from "./friend.entity";
import { FriendRequest } from "./friend_request.entity";

@Entity('users')
export class User extends BaseEntity {
    

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({
        unique: true
    })
    username: string;

    @Column({ type: "varchar", length: 60, nullable: true})
    password: string;

    @Column({ type: "varchar", nullable: true})
    socketId: string;

    @Column({ type: "bool", nullable: true})
    isOnline: boolean;

    @OneToMany( () => FriendRequest, friendRequest => friendRequest.requester, {cascade: true, eager: true} )
    friendRequests: Array<FriendRequest>;

    @OneToMany( () => Friend, friend => friend.user, {cascade: true, eager: true} )
    friends: Array<Friend>;

    @ManyToOne( () => Room, room => room.users)
    room: Room;
 
    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }


    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}