import {
  IApiResponse,
  IMedicalRecord,
  IMedicalRecordQueryParams,
  INewMedicalRecordPayload,
  INewPrescription,
  IUpdateMedicalRecordPayload,
} from '../types';
import { axiosClient } from "../config/axios";

export const medicalRecordApi = {
  getMedicalRecords: (
    params: IMedicalRecordQueryParams,
  ): Promise<IApiResponse<IMedicalRecord[]>> => {
    return axiosClient.get('/medical-records', {
      params,
    });
  },

  getMedicalRecordDetail: (id: number): Promise<IApiResponse<IMedicalRecord>> => {
    return axiosClient.get(`/medical-records/${id}`);
  },

  createMedicalRecord: (data: INewMedicalRecordPayload): Promise<IApiResponse<any>> => {
    return axiosClient.post('/medical-records-2', data);
  },

  updateMedicalRecord: (
    id: number,
    data: IUpdateMedicalRecordPayload,
  ): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/medical-records/${id}`, data);
  },

  deleteMedicalRecord: (id: number): Promise<IApiResponse<any>> => {
    return axiosClient.delete(`/medical-records/${id}`);
  },

  updatePrescription: (id: number, payload: INewPrescription[]): Promise<IApiResponse<any>> => {
    return axiosClient.put(`/medical-records/${id}/prescription`, { prescriptions: payload });
  },
};
