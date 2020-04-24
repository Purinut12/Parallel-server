import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { ChatRoom_User, ChatRoom } from '../entities/chatroom.entity';
import { ChatroomService } from '../chatroom/chatroom.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, ChatRoom_User])],
  controllers: [MessageController],
  providers: [MessageService, UserService],
  exports: [MessageService],
})
export class MessageModule {}
