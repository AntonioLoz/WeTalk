import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friendship } from "./friendship.entity";
import { User } from "./user.entity";

@Entity('personal_messages')
export class PersonalMessage extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {type: 'text', nullable: false} )
    message: string;

    @ManyToOne( () => User, user => user.personalMessages, { eager: true } )
    sender: User;

    @ManyToOne( () => User, user => user.personalMessages, { eager: true })
    receiver: User;

    @ManyToOne( () => Friendship, friendship => friendship.messages)
    friendship: Friendship;

    @CreateDateColumn()
    createdAt: Date;

    constructor(message: string, sender: User, receiver: User, friendship: Friendship){
        super();
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.friendship = friendship;
    }
}