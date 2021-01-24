import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity('group_messages')
export class GroupMessage extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {type: 'text', nullable: false} )
    message: string;

    @CreateDateColumn( {name: 'created_at'} )
    createdAt: Date;

    @ManyToOne( () => Group, group => group.messages )
    group: Group;

    @ManyToOne( () => User, user => user.id)
    user: User;
}