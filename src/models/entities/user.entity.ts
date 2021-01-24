import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt  from 'bcrypt'
import { Friendship } from "./friendship.entity";
import { PersonalMessage } from "./personal_message.entity";
import { UserToGroup } from "./user_group.entity";

@Entity('users')
export class User extends BaseEntity {
    

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({ unique: true })
    username: string;

    @Column({ type: "varchar", length: 60, nullable: true })
    password: string;

    @Column({ type: "varchar", nullable: true })
    socketId: string;

    @Column({ type: "bool", nullable: true })
    isOnline: boolean;

    @ManyToMany( () => Friendship, friendship => friendship.users, { cascade: true } )
    friendships: Array<Friendship>;

    @OneToMany( () => PersonalMessage, message => message.id, { cascade: false })
    personalMessages: Array<PersonalMessage>;

    @OneToMany( () => UserToGroup, userGroup => userGroup.group)
    userToGroups: Array<UserToGroup>;
 
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