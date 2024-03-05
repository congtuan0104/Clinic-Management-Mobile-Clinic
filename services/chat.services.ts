import { axiosClient } from "../config/axios";
import { IApiResponse, GroupChatInfo, ICreateGroupChatRequest } from "../types";
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
  async removeMemberOutGroupChat(groupChatId: string, userList: string[]) {
    return axiosClient.delete(`/chats/${groupChatId}/user/`, {
      data: {
        userList,
      },
    });
  },
  async updateGroupChatName(groupId: string, groupName: string) {
    return axiosClient.put(`/chats/${groupId}`, groupName);
  },
  async deleteGroupChat(groupId: string) {
    return axiosClient.delete(`/chats/${groupId}`);
  },
};
