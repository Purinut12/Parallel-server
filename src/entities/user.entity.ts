import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';

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
