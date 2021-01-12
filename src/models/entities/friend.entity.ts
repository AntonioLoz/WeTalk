import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDTO } from "../dtos/user.dto";
import { User } from "./user.entity";

@Entity('friends')
export class Friend extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne( () => User, user => user.id)
    user: UserDTO;

    @ManyToOne(() => User, user => user.id)
    friend: UserDTO;

    @CreateDateColumn()
    registeredAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;


    constructor(user: UserDTO, friend: UserDTO) {
        
        super();
        this.user = user;
        this.friend = friend;
    }
}