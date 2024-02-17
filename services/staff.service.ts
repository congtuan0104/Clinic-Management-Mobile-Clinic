import { IApiResponse, IClinicStaffDetail, ICreateStaffPayload } from '../types';
import { IClinicStaff, IStaffQueryParams } from '../types';
import { axiosClient } from "../config/axios";

export const staffApi = {
  getStaffs(params: IStaffQueryParams): Promise<IApiResponse<IClinicStaff[]>> {
    return axiosClient.get('/staffs', { params: params });
  },

  getStaff(staffId: string): Promise<IApiResponse<IClinicStaffDetail>> {
    return axiosClient.get(`/staffs/${staffId}`);
  },

  createStaff(data: ICreateStaffPayload): Promise<any> {
    return axiosClient.post('/staffs', data);
  },

  deleteStaff(staffId: string): Promise<any> {
    return axiosClient.delete(`/staffs/${staffId}`);
  },
};
