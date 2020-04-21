import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './message.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async getMessageFromChatId(chatId: number): Promise<Message[]> {
    let resp = await this.messageRepository.find({
      where: { chatRoom: chatId },
    });
    return resp;
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    createMessageDto.createdTime = new Date();

    if (!createMessageDto.senderName) {
      let user = await this.userService.getUserByUserId(
        createMessageDto.client,
      );
      createMessageDto.senderName = user.userName;
    }

    if (!createMessageDto.type) createMessageDto.type = 0;

    return this.messageRepository.insert(createMessageDto);
  }
}
