export class NewMessageDto {
  text: string;
  userName: string;
  createdTime: Date;
}

export class NewGroupDto {
  chatName: string;
  chatRoom: number;
  member: number[];
}

export class NewJoinGroupDto {
  userName: string;
  joinedTime: Date;
}

export class LeftMemberDto {
  userName: string;
  leftTime: Date;
}