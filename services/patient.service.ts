import { IApiResponse, ICreatePatientPayload, IPatient, IPatientQueryParams } from '../types';
import { axiosClient } from "../config/axios";

export const patientApi = {
  getPatients: (params: IPatientQueryParams): Promise<IApiResponse<IPatient[]>> => {
    return axiosClient.get('/patients', {
      params,
    });
  },

  getPatientDetail: (id: number): Promise<any> => {
    return axiosClient.get(`/patients/${id}`);
  },

  createPatient: (data: ICreatePatientPayload): Promise<any> => {
    return axiosClient.post('/patients', data);
  },

  updatePatient: (id: number, data: any): Promise<any> => {
    return axiosClient.put(`/patients/${id}`, data);
  },

  deletePatient: (id: number): Promise<any> => {
    return axiosClient.delete(`/patients/${id}`);
  },
};
