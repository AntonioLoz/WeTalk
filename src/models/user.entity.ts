import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import * as bcrypt  from 'bcrypt'

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({
        unique: true
    })
    readonly username: string;

    @Column({ type: "varchar", length: 60, nullable: true})
    password: string;

    @Column({ type: "varchar", nullable: true})
    socketId: string

    @ManyToOne( () => Room, room => room.users)
    room: Room;
 

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