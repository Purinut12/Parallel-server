import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message,User])],
  controllers: [MessageController],
  providers: [MessageService,UserService],
  exports: [MessageService],
})
export class MessageModule {}
