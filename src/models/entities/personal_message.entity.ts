import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friendship } from "./friendship.entity";
import { User } from "./user.entity";

@Entity('personal_messages')
export class PersonalMessage extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {type: 'text', nullable: false} )
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne( () => Friendship, friendship => friendship.messages )
    friendship: Friendship;

    @ManyToOne( () => User, user => user.personalMessages, { eager: true } )
    user: User;
}