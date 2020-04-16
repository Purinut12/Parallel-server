export class CreateMessageDto {
    text: string;
    client: string;
    createdTime?: Date;
    chatId: number;
}