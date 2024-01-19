import { axiosClient } from "../config/axios";
import { IApiResponse, GroupChatInfo, ICreateGroupChatRequest } from "../types";

const mockData = [
  { id: "1", groupName: "chat 1", maxMember: 20 },
  { id: "2", groupName: "chat 13", maxMember: 201 },
  { id: "3", groupName: "chat 14", maxMember: 202 },
  { id: "4", groupName: "chat 113", maxMember: 24 },
  { id: "5", groupName: "chat 11", maxMember: 27 },
];

const listData = [
  {
    id: "1",
    name: "Phòng khám YDS Phòng khám YDS Phòng khám YDS Phòng khám YDS ",
    avatar_url:
      "https://images.pexels.com/photos/2811087/pexels-photo-2811087.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    subtitle: "Hey there, how are you?",
  },
  {
    id: "2",
    name: "Chris Jackson",
    avatar_url:
      "https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    subtitle: "Where are you?",
  },
  {
    id: "3",
    name: "Jenifar Lawrence",
    avatar_url:
      "https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg",
    subtitle: "I am good, how are you?",
  },
  {
    id: "4",
    name: "Tom Holland",
    avatar_url:
      "https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600",
    subtitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  },
  {
    id: "5",
    name: "Robert",
    avatar_url:
      "https://expertphotography.b-cdn.net/wp-content/uploads/2020/05/male-poses-squint.jpg",
    subtitle: "Where does it come from?",
  },
  {
    id: "6",
    name: "downey junior",
    avatar_url:
      "https://www.apetogentleman.com/wp-content/uploads/2018/06/male-models-marlon.jpg",
    subtitle: "Where can I get some?",
  },
  {
    id: "7",
    name: "Ema Watson",
    avatar_url:
      "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    subtitle: "I am good, how are you?",
  },
  {
    id: "8",
    name: "Chris Jackson",
    avatar_url:
      "https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    subtitle:
      " If you use this site regularly and would like to help keep the site",
  },
  {
    id: "9",
    name: "Jenifar Lawrence",
    avatar_url:
      "https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg",
    subtitle: "Why do we use it?",
  },
  {
    id: "10",
    name: "Tom Holland",
    avatar_url:
      "https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600",
    subtitle:
      " If you use this site regularly and would like to help keep the site",
  },
  {
    id: "11",
    name: "group_1",
    avatar_url:
      "https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600",
    subtitle:
      " If you use this site regularly and would like to help keep the site",
  },
  {
    id: "12",
    name: "group_2",
    avatar_url:
      "https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600",
    subtitle:
      " If you use this site regularly and would like to help keep the site",
  },
];
export const chatService = {
  async getGroupChatByGroupId(groupId: string) {
    return axiosClient.get(`/chats/${groupId}/users`);
  },
  async createGroupChat(createGroupChatRequest: any) {
    return axiosClient.post("/chats", createGroupChatRequest);
  },
  async getListGroupChatByUserId(
    userId: string | undefined
  ): Promise<IApiResponse<GroupChatInfo[]>> {
    return axiosClient.get("/chats", {
      params: {
        userId,
      },
    });
  },
  async inviteUsersToGroupChat(
    groupChatId: string,
    userId: string,
    userList: string[]
  ) {
    return axiosClient.post(`chats/${groupChatId}/user/${userId}`, userList);
  },
  async removeMemberOutGroupChat(groupChatId: string, userId: string) {
    return axiosClient.delete(`/chats/${groupChatId}/user/${userId}`);
  },
  async updateGroupChatName(groupId: string, groupName: string) {
    return axiosClient.put(`/chats/${groupId}`, groupName);
  },
  async deleteGroupChat(groupId: string) {
    return axiosClient.delete(`/chats/${groupId}`);
  },
};
