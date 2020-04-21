export class CreateMessageDto {
  text: string;
  client?: any;
  createdTime?: Date;
  chatRoom: any;
  type: number;
  senderName?: string;
  clientId?: number;
}
