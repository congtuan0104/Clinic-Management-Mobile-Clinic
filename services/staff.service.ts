import {
  IApiResponse,
  IClinicStaffDetail,
  ICreateStaffPayload,
  IStaffSchedule,
} from "../types";
import { IClinicStaff, IStaffQueryParams } from "../types";
import { axiosClient } from "../config/axios";

export const staffApi = {
  getStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get("/staffs", { params: params });
  },

  getStaff(staffId: string): Promise<IApiResponse<IClinicStaff | any>> {
    return axiosClient.get(`/staffs/${staffId}`);
  },

  createStaff(data: ICreateStaffPayload): Promise<any> {
    return axiosClient.post("/staffs", data);
  },

  deleteStaff(staffId: string): Promise<any> {
    return axiosClient.delete(`/staffs/${staffId}`);
  },
  getStaffSchedule(staffId: string): Promise<IApiResponse<IStaffSchedule[]>> {
    return axiosClient.get(`/staffs/${staffId}/schedule`);
  },
};
