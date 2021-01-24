import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupMessage } from "./group_message.entity";
import { UserToGroup } from "./user_group.entity";

@Entity('groups')
export class Group extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {type: 'varchar', length: 30, nullable: false} )
    name: string;

    @OneToMany( () => GroupMessage, message => message.group )
    messages: Array<GroupMessage>;

    @OneToMany( () => UserToGroup, userGroup => userGroup.group)
    userToGroups: Array<UserToGroup> 

    @CreateDateColumn({ name: 'created_at' } )
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' } )
    updatedAt: Date
}