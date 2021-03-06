import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column('varchar', { length: 500 })
  text: string;

  @ManyToOne(
    type => User,
    client => client.messages,
  )
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column('integer')
  clientId: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @ManyToOne(
    type => ChatRoom,
    chatRoom => chatRoom.messages,
  )
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column('integer') //0 for normal message and 1 for join message
  type: number;

  @Column('varchar', { length: 50 })
  senderName: string;
}
