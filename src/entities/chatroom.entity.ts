import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  chatRoomId: number;

  @Column('varchar', { length: 50 })
  chatName: string;

  @OneToMany(
    type => Message,
    message => message.chatRoom,
  )
  messages: Message[];
}

@Entity()
@Unique(['chatRoomId', 'userId'])
export class ChatRoom_User {
  // @PrimaryColumn('number')
  // chatRoomId: number;

  // @PrimaryColumn('number')
  // userId: number;

  @Column('varchar', { length: 50 })
  chatName: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  lastReadTime: Date;

  @OneToOne(
    type => ChatRoom,
    chatRoom => chatRoom.chatRoomId,
    { primary: true },
  )
  @PrimaryColumn()
  //@JoinColumn({ name: "chatRoomId" })
  chatRoomId: number;

  @OneToOne(
    type => User,
    user => user.userId,
    { primary: true },
  )
  @PrimaryColumn()
  //@JoinColumn({ name: "userId" })
  userId: number;
}
