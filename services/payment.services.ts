import { axiosClient } from "../config/axios";
import { IApiResponse } from "../types";

export const paymentService = {
  async createPayment(paymentInfo: any): Promise<IApiResponse<any>> {
    return axiosClient.post("/payment", paymentInfo);
  },
};
