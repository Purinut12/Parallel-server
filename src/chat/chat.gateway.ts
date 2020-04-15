import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(10001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users = 0;

    async handleConnection(){
        console.log("New User");
        // A client has connected
        this.users++;

        // Notify connected clients of current users
        this.server.emit('users', this.users);
        console.log(this.users);

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
    }

}