import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdTime: Date;

  @Column('integer', { nullable: true }) //chat room
  chatId: number;
}
