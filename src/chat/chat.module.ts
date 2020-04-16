import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            Message
        ])
    ],
    controllers: [ChatController],
    providers: [ ChatGateway, MessageService, ChatService ],
    exports: [ChatService],
})
export class ChatModule {}