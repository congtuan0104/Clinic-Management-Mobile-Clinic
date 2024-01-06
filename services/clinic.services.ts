import { axiosClient } from "../config/axios";
import { IApiResponse } from "../types";
import {
  IClinicInfo,
  IUserInClinicInfo,
  IClinicCreate,
} from "../types/clinic.types";

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
};
