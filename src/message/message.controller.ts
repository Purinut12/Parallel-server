import { Controller, Get, Param, Body, Post, Patch } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId')
  async getMessageFromChatId(@Param('chatId') chatId: number) {
    return this.messageService.getMessageFromChatId(chatId);
  }

  @Get(':chatRoomId/:userId')
  async getUnreadMessage(
    @Param('chatRoomId') chatRoomId: number,
    @Param('userId') userId: number,
  ) {
    return this.messageService.getUnreadMessage(chatRoomId, userId);
  }

  @Post()
  async addMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.addMessage(createMessageDto);
  }

  @Patch('test')
  async test() {
    return this.messageService.test();
  }
}
