export class NewMessageDto {
  text: string;
  userName: string;
  createdTime: Date;
  chatRoom: number;
}

export class NewGroupDto {
  chatName: string;
  chatRoom: number;
  member: number[];
}

export class NewJoinGroupDto {
  userName: string;
  joinedTime: Date;
  chatRoom: number;
}

export class LeftMemberDto {
  userName: string;
  leftTime: Date;
  chatRoom: number;
}
