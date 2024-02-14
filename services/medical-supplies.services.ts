//https://staging.api.clinus.live/api/medical-supplies?clinicId=ed8b694b-28e3-47e3-beaa-25cdf8830ef1
import { axiosClient } from "../config/axios";
import { IApiResponse } from "../types";

export const medicalSuppliesServices = {
  async getMedicalSupplies(clinicId: any): Promise<IApiResponse<any>> {
    return axiosClient.get(`/medical-supplies?clinicId=${clinicId}`);
  },
};
