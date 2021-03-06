import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom, ChatRoom_User } from 'src/entities/chatroom.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateChatRoomDto, JoinOrLeaveChatRoomDto } from './chatroom.dto';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(ChatRoom_User)
    private readonly chatRoom_UserRepository: Repository<ChatRoom_User>,
  ) {}

  async getChatRoom(userId: any): Promise<any[]> {
    let allChatRooms = await this.chatRoomRepository.find();
    let resp = [];
    //console.log(allChatRooms);

    let chatRoomOfUser = await this.chatRoom_UserRepository.find({
      where: { userId },
    });
    await chatRoomOfUser.sort();
    //console.log(chatRoomOfUser);

    let idx = 0;
    let N = chatRoomOfUser.length;

    let allChatRoomUser = await this.chatRoom_UserRepository.find();
    await allChatRoomUser.sort();

    allChatRooms.forEach(chatRoom => {
      let curChatRoomId = -1;
      if (idx < N) curChatRoomId = chatRoomOfUser[idx].chatRoomId;

      let tmp = {
        chatRoomId: chatRoom.chatRoomId,
        chatName: chatRoom.chatName,
        isMember: chatRoom.chatRoomId == curChatRoomId ? true : false,
        members: [],
      };
      let members = allChatRoomUser.filter(
        chatRoom_User => chatRoom_User.chatRoomId == chatRoom.chatRoomId,
      );
      members.forEach(chatRoom_User => {
        tmp.members.push(chatRoom_User.userId);
      });

      resp.push(tmp);
      if (curChatRoomId != -1)
        while (idx < N && chatRoom.chatRoomId >= chatRoomOfUser[idx].chatRoomId)
          idx++;
    });
    return resp;
  }

  async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
    createChatRoomDto.messages = [];
    createChatRoomDto.members = [createChatRoomDto.user];

    let chatRoom = await this.getChatRoombyChatName(createChatRoomDto.chatName);
    if (chatRoom)
      throw new BadRequestException(
        'Already have chat room name ' + createChatRoomDto.chatName,
      );

    let resp = await this.chatRoomRepository.insert(createChatRoomDto);
    let resp2 = await this.chatRoom_UserRepository.insert({
      chatRoomId: resp.identifiers[0].chatRoomId,
      userId: createChatRoomDto.user,
      chatName: createChatRoomDto.chatName,
    });
    return resp;
  }

  async joinChatRoom(joinChatRoomDto: JoinOrLeaveChatRoomDto) {
    let chatId = joinChatRoomDto.chatId;
    let userId = joinChatRoomDto.userId;
    let chatRooms = await this.chatRoom_UserRepository.find({
      where: { chatRoomId: chatId },
    });
    let isAlreadyJoined = false;
    chatRooms.forEach(chatRoom => {
      if (chatRoom.userId == userId) isAlreadyJoined = true;
    });
    if (!isAlreadyJoined) {
      let chatRoom = await this.getChatRoombyChatRoomId(chatId);
      return this.chatRoom_UserRepository.insert({
        chatRoomId: chatId,
        userId: userId,
        chatName: chatRoom.chatName,
      });
    }
    throw new BadRequestException('Already joined this chat room');
  }

  async leaveChatRoom(joinChatRoomDto: JoinOrLeaveChatRoomDto) {
    let chatId = joinChatRoomDto.chatId;
    let userId = joinChatRoomDto.userId;
    let chatRooms = await this.chatRoom_UserRepository.find({
      where: { chatRoomId: chatId },
    });
    let isAlreadyJoined = false;
    chatRooms.forEach(chatRoom => {
      if (chatRoom.userId == userId) isAlreadyJoined = true;
    });
    if (isAlreadyJoined) {
      return this.chatRoom_UserRepository.delete({
        chatRoomId: chatId,
        userId: userId,
      });
    }
    throw new BadRequestException('User is not in this chat room');
  }

  async getChatRoombyChatRoomId(chatRoomId: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne(chatRoomId);
  }

  async getChatRoomByUserId(userId: number): Promise<ChatRoom_User[]> {
    return this.chatRoom_UserRepository.find({
      where: { userId: userId },
    });
  }

  async getChatRoombyChatName(chatName: string) {
    return this.chatRoomRepository.findOne({
      where: { chatName: chatName },
    });
  }

  async readChatRoom(chatRoomId: number, userId: number) {
    let currentTime = new Date();
    return this.chatRoom_UserRepository.update(
      { chatRoomId, userId },
      { lastReadTime: currentTime },
    );
  }
}
