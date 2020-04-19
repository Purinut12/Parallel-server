import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getMessageFromChatId(chatId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatId: chatId },
    });
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    createMessageDto.createdTime = new Date();
    if (!createMessageDto.type) createMessageDto.type = 0;
    return this.messageRepository.insert(createMessageDto);
  }
}
