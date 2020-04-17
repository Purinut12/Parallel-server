import { User } from '../entities/user.entity';

export class CreateMessageDto {
  text: string;
  client: User;
  createdTime?: Date;
  chatId: number;
}
