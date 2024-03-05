// export interface GroupChatInfo {
//   id: string;
//   groupName: string;
//   maxMember: number;
// }

export interface GroupChatInfo {
  id: number;
  groupName: string;
  maxMember: number;
  type: string | null;
  isActive: boolean;
  groupChatMember: IGroupChatMember[] | [] | null;
}

export interface IGroupChatMember {
  userId: string;
  isAdmin: boolean;
  joinedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
export interface ICreateGroupChatRequest {
  groupName: string;
  maxMember: number;
  type: string;
}
