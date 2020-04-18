import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ChatRoom, ChatRoom_User } from 'src/entities/chatroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, ChatRoom, ChatRoom_User])],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    MessageService,
    ChatService,
    UserService,
    ChatroomService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
