import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column('varchar', {length : 500})
    text: string;

    /*
    @ManyToOne(
        type => User
    )
    //client: User;
    */
    @Column('varchar', {length : 50})
    client: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdTime: Date;

    @Column('integer', {nullable: true}) //chat room
    chatId: number;
}