import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/message.dto';
import { User } from 'src/entities/user.entity';
import { NewMessageDto, NewGroupDto, NewJoinGroupDto } from './chat.dto';
import { UserService } from 'src/user/user.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import {
  CreateChatRoomDto,
  JoinOrLeaveChatRoomDto,
} from 'src/chatroom/chatroom.dto';

@WebSocketGateway(10001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly chatRoomService: ChatroomService,
  ) {}

  @WebSocketServer() server;
  users = 0;

  async handleConnection(socket: Socket) {
    console.log('[New User] :\t', socket.id);
    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  async handleDisconnect(socket: Socket) {
    console.log('[User disconnected]: \t', socket.id);

    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('sent-message')
  async onChat(socket: Socket, data: any) {
    let message = data.text;
    let userId = data.client;
    let chatRoomId = data.chatRoom;
    console.log('[Message] :\t', message, 'sent from', socket.id);

    let createMessageDto: CreateMessageDto = {
      text: message,
      client: userId,
      chatRoom: chatRoomId,
      type: 0,
    };
    let resp = await this.messageService.addMessage(createMessageDto);

    let user = await this.userService.getUserByUserId(userId);

    let chatRoom = await this.chatRoomService.getChatRoombyChatRoomId(
      chatRoomId,
    );

    let newMessageDto: NewMessageDto = {
      text: message,
      createdTime: resp.generatedMaps[0].createdTime,
      userName: user.userName,
    };
    this.server.to(chatRoom.chatName).emit('new-message', newMessageDto);
  }

  @SubscribeMessage('create-group')
  async createRoom(socket: Socket, data: any) {
    let chatName = data.chatName;
    let userId = data.client;

    socket.join(chatName);
    //socket.to(chatName).emit('roomCreated', {room: chatName});
    //return { event: 'roomCreated', room: 'aRoom' };

    let createChatRoomDto: CreateChatRoomDto = {
      chatName: chatName,
      user: userId,
    };
    let resp = await this.chatRoomService.createChatRoom(createChatRoomDto);

    let newGroupDto: NewGroupDto = {
      chatName: chatName,
      chatRoom: resp.identifiers[0].chatRoomId,
      member: [userId],
    };
    console.log('[Create group]:\t', chatName);
    this.server.emit('new-group', newGroupDto);
  }

  @SubscribeMessage('join-group')
  async joinRoom(socket: Socket, data: any) {
    let chatRoomId = data.chatRoom;
    let userId = data.client;

    let user = await this.userService.getUserByUserId(userId);

    let createMessageDto: CreateMessageDto = {
      text: user.userName + ' has joined',
      client: userId,
      chatRoom: chatRoomId,
      type: 1,
    };

    let joinOrLeaveChatRoomDto: JoinOrLeaveChatRoomDto = {
      chatId: chatRoomId,
      userId: userId,
    };
    let respJoin = await this.chatRoomService.joinChatRoom(
      joinOrLeaveChatRoomDto,
    );

    let respMessage = await this.messageService.addMessage(createMessageDto);

    let chatRoom = await this.chatRoomService.getChatRoombyChatRoomId(
      chatRoomId,
    );

    socket.join(chatRoom.chatName);

    let newJoinGroupDto: NewJoinGroupDto = {
      userName: user.userName,
      joinedTime: respMessage.generatedMaps[0].createdTime,
    };

    console.log(
      '[Join group] :\t',
      user.userName,
      'has join',
      chatRoom.chatName,
    );

    this.server.to(chatRoomId).emit('new-member', newJoinGroupDto);
  }

  @SubscribeMessage('login')
  async login(socket: Socket, { userName }: any) {
    let user = await this.userService.getUserByUserName(userName);
    let chatRoom_User = await this.chatRoomService.getChatRoomByUserId(
      user.userId,
    );

    chatRoom_User.forEach(chatRoom => {
      console.log(socket.id, chatRoom.chatName);
      socket.join(chatRoom.chatName);
    });
    console.log('[Login] :\t', userName, socket.id);
  }

  @SubscribeMessage('test')
  async test(socket: Socket) {
    console.log(socket.id);
    this.server.to('dog').emit('test2', 'wanwan');
  }
}
