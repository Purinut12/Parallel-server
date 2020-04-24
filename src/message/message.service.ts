import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository, MoreThan } from 'typeorm';
import { CreateMessageDto } from './message.dto';
import { UserService } from '../user/user.service';
import { ChatRoom_User } from '../entities/chatroom.entity';
import { ChatroomService } from '../chatroom/chatroom.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(ChatRoom_User)
    private readonly chatRoom_UserRepository: Repository<ChatRoom_User>,
    private readonly userService: UserService,
  ) {}

  async getMessageFromChatId(chatId: number): Promise<Message[]> {
    let resp = await this.messageRepository.find({
      where: { chatRoom: chatId },
    });
    return resp;
  }

  async getUnreadMessage(chatRoomId: number, userId: number): Promise<Message[]>{
    let chatRoom_User = await this.chatRoom_UserRepository.findOne({where:{chatRoomId,userId}})
    return this.messageRepository.find({ where: { chatRoom: chatRoomId, createdTime: MoreThan(chatRoom_User.lastReadTime)} })
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    createMessageDto.createdTime = new Date();
    createMessageDto.clientId = createMessageDto.client;

    if (!createMessageDto.senderName) {
      let user = await this.userService.getUserByUserId(
        createMessageDto.client,
      );
      createMessageDto.senderName = user.userName;
    }

    if (!createMessageDto.type) createMessageDto.type = 0;

    return this.messageRepository.insert(createMessageDto);
  }

  async getMessage(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  //For add new attribute(senderName)
  async test() {
    let messages = await this.getMessage();
    messages.forEach(async message => {
      let user = await this.userService.getUserByUserId(message.clientId);
      let editMessage = {
        messageId: message.messageId,
        senderName: user.userName,
      };
      this.messageRepository.save(editMessage);
    });
    return 'OK';
  }
}
