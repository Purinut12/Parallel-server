import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom, ChatRoom_User } from 'src/entities/chatroom.entity';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatRoom_User])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
