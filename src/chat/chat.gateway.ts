import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/message.dto';
import { User } from 'src/entities/user.entity';

@WebSocketGateway(10001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly messageService: MessageService) {}

    @WebSocketServer() server;
    users = 0;

    async handleConnection(){
        console.log("New User");
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }

    async handleDisconnect(){
        console.log("User disconnected");

        // A client has disconnected
        this.users--;

        // Notify connected clients of current users
        this.server.emit('users', this.users);

    }

    @SubscribeMessage('sent-message')
    async onChat(client: Socket, message: string) {
        console.log(message);
        this.server.emit('new-message', message);
        //client.broadcast.emit('chat', message);
        //return {event: 'chat',data: message};
        //* test
        let createMessageDto: CreateMessageDto ={
            text: message,
            client: {userId: 1, userName: 'shiba', createdTime: new Date(), messages:[]},
            chatId: 1
        };
        //*/
        this.messageService.addMessage(createMessageDto);
    }

}