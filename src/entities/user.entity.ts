import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Message } from './message.entity';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('varchar', { length: 50 })
  userName: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @OneToMany(
    type => Message,
    message => message.client,
  )
  messages: Message[];
}
