import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Message } from "./message.entity";

@Entity()
export class ChatRoom{
    @PrimaryGeneratedColumn()
    chatRoomId: number;

    @Column('varchar', {length : 50})
    chatName: string;

    @OneToMany(
        type => Message,
        message => message.chatRoom
    )
    messages: Message[];
}

@Entity()
export class ChatRoom_User{
    /*
    @OneToOne(type => ChatRoom, { primary: true, cascade: true, eager: true })
    @JoinColumn({ name: "ChatRoomId" })
    */
    @PrimaryColumn('integer')
    chatRoomId: number;

    /*
    @OneToOne(type => User, { primary: true, cascade: true })
    @JoinColumn({ name: "UserId" })
    */
    @PrimaryColumn('integer')
    userId: number;
}