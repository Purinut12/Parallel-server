import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { User } from 'src/entities/user.entity';
import { CreateChatRoomDto, joinOrLeaveChatRoomDto } from './chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatRoomService: ChatroomService) {}

  @Get(':userId')
  async getChatRoom(@Param('userId') userId: User) {
    return this.chatRoomService.getChatRoom(userId);
  }

  @Post()
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.createChatRoom(createChatRoomDto);
  }

  @Patch('/join')
  async joinChatRoom(@Body() joinChatRoomDto: joinOrLeaveChatRoomDto) {
    return this.chatRoomService.joinChatRoom(joinChatRoomDto);
  }

  @Patch('/leave')
  async leaveChatRoom(@Body() joinChatRoomDto: joinOrLeaveChatRoomDto) {
    return this.chatRoomService.leaveChatRoom(joinChatRoomDto);
  }
}
