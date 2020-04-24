import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { User } from 'src/entities/user.entity';
import { CreateChatRoomDto, JoinOrLeaveChatRoomDto } from './chatroom.dto';

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
  async joinChatRoom(@Body() joinChatRoomDto: JoinOrLeaveChatRoomDto) {
    return this.chatRoomService.joinChatRoom(joinChatRoomDto);
  }

  @Patch('/leave')
  async leaveChatRoom(@Body() joinChatRoomDto: JoinOrLeaveChatRoomDto) {
    return this.chatRoomService.leaveChatRoom(joinChatRoomDto);
  }

  @Patch('/read/:chatRoomId/:userId')
  async readChatRoom(@Param('chatRoomId') chatRoomId: number, @Param('userId') userId: number){
    return this.chatRoomService.readChatRoom(chatRoomId,userId);
  }
}
