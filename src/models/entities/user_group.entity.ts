import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { RoleGroup } from "../enums/role_group";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity('users_groups')
export class UserToGroup extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: RoleGroup, nullable: false })
    role: RoleGroup;

    @ManyToOne( () => User, user => user.userToGroups)
    user: User;

    @ManyToOne( () => Group, group => group.userToGroups)
    group: Group;
}