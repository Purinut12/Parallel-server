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
import { CreateChatRoomDto } from 'src/chatroom/chatroom.dto';

@WebSocketGateway(10001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly chatRoomService: ChatroomService,
  ) {}

  @WebSocketServer() server;
  users = 0;

  async handleConnection() {
    console.log('New User');
    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  async handleDisconnect() {
    console.log('User disconnected');

    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('sent-message')
  async onChat(client: Socket, data: any) {
    let message = data.text;
    let userId = data.client;
    let chatRoomId = data.chatRoom;

    let createMessageDto: CreateMessageDto = {
      text: message,
      client: userId,
      chatRoom: chatRoomId,
      type: 0
    };
    let resp = await this.messageService.addMessage(createMessageDto);

    let user = await this.userService.getUserByUserId(userId);

    let newMessageDto: NewMessageDto = {
      text: message,
      createdTime: resp.generatedMaps[0].createdTime,
      userName: user.userName,
    };
    this.server.emit('new-message', newMessageDto);
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
    this.server.emit('new-group', newGroupDto);
  }

  @SubscribeMessage('join-group')
  async joinRoom(socket: Socket, data: any) {
    let chatRoomId = data.chatRoom;
    let userId = data.client;

    socket.join(chatRoomId);

    let user = await this.userService.getUserByUserId(userId);

    let resp = await this.messageService.addMessage();

    let newJoinGroupDto: NewJoinGroupDto = {
      userName: user.userName,
      joinedTime: new Date(), // To be edit *********************************************************************
    };

    console.log(user.userName, 'has join', chatRoomId);

    this.server.to(chatRoomId).emit('new-member', newJoinGroupDto);
  }

  @SubscribeMessage('test')
  async test() {
    this.server.to('group111').emit('test2', 'hello');
  }
}
