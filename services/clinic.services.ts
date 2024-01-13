import { axiosClient } from "../config/axios";
import { IApiResponse } from "../types";
import {
  IClinicInfo,
  IUserInClinicInfo,
  IClinicCreate,
} from "../types/clinic.types";
import { IRole } from "../types/role.types";

export const clinicService = {
  async getUsersInClinic(
    clinicId: string
  ): Promise<IApiResponse<IUserInClinicInfo[]>> {
    return axiosClient.get(`/clinics/${clinicId}/users`);
  },
  async getAllClinic(): Promise<IApiResponse<IClinicInfo[]>> {
    return axiosClient.get(`/clinics`);
  },
  async updateClinicInfo(
    clinicId: string,
    clinicInfo: IClinicCreate
  ): Promise<IApiResponse<IClinicInfo>> {
    return axiosClient.put(`/clinics/${clinicId}`, clinicInfo);
  },
  async getClinicByClinicId(
    clinicId: string
  ): Promise<IApiResponse<IClinicInfo>> {
    return axiosClient.get(`/clinics/${clinicId}`);
  },
  async getCLinicByUserId(userId: any) {
    return axiosClient.get(`/clinics`, {
      params: {
        id: userId,
      },
    });
  },
  async createClinic(clinicInfo: IClinicCreate) {
    return axiosClient.post("/clinics", clinicInfo);
  },
  async getUserGroupRole(clinicId: any): Promise<IApiResponse<IRole[]>> {
    return axiosClient.get(`/clinics/${clinicId}/user-group-role`);
  },
  async createUserGroupRole(clinicId: any, userGroupRole: any) {
    return axiosClient.post(
      `/clinics/${clinicId}/create-user-group-role`,
      userGroupRole
    );
  },
};
