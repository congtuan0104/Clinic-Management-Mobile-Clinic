import { axiosClient } from "../config/axios";
import { IApiResponse } from "../types";
import { IStaff } from "../types/staff.types";

export const staffServices = {
  async getPermissions(
    clinicId: any,
    userId: any
  ): Promise<IApiResponse<IStaff[]>> {
    return axiosClient.get(`/staffs?clinicId=${clinicId}&userId=${userId}`);
  },
};
