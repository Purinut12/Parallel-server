import { User } from '../entities/user.entity';

export class CreateMessageDto {
  text: string;
  client: any;
  createdTime?: Date;
  chatId: number;
}
