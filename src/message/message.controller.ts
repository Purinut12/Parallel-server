import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId')
  async getMessageFromChatId(@Param('chatId') chatId: number) {
    return this.messageService.getMessageFromChatId(chatId);
  }

  @Post()
  async addMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.addMessage(createMessageDto);
  }
}
