import { MEDICO_PAYMENT_STATUS, MEDICO_RECORD_STATUS } from '../enums';
import { IClinicInfo, IClinicStaff, IPatient } from '.';

export interface IMedicalService {
  id: number;
  clinicServiceId: number;
  clinicId: string;
  medicalRecordId: number;
  doctorId: number;
  doctorName: string;
  serviceName: string;
  serviceResult?: string;
  amount: number;
  returnCode?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IPrescription extends INewPrescription {
  id: number;
  medicalRecordId: number;
}

export interface INewPrescription {
  medicineName: string;
  dosage: number;
  unit: string;
  duration: string;
  usingTime: string;
  doseInterval: string;
  note: string;
}

export interface IMedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: string;
  dateCreated: Date;
  height?: number;
  weight?: number;
  bloodPressure?: number;
  temperature?: number;
  diagnose?: string;
  result?: string;
  examinationStatus: MEDICO_RECORD_STATUS;
  paymentStatus: MEDICO_PAYMENT_STATUS;
  note?: string;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    specialize?: string;
  };
  clinicRequestServices: any[];
  medicalRecordServices: IMedicalService[];
  prescriptionDetail: IPrescription[];
  patient: IPatient;
  clinic: IClinicInfo;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface INewMedicalRecordPayload {
  patientId: number;
  clinicId: string;
  doctorId: number;
  note: string;
  services: INewRecordService[];
}

export interface INewRecordService {
  clinicServiceId?: number;
  clinicId?: string;
  doctorId?: number;
  serviceName?: string;
  amount?: number;
}

export interface IUpdateMedicalRecordPayload {
  height?: number;
  weight?: number;
  bloodPressure?: number;
  temperature?: number;
  diagnose?: string;
  result?: string;
  examinationStatus?: MEDICO_RECORD_STATUS;
  paymentStatus?: MEDICO_PAYMENT_STATUS;
  note?: string;
  patientId?: number;
  clinicId?: string;
  doctorId?: number;
}

export interface IMedicalRecordQueryParams {
  clinicId?: string;
  doctorId?: number;
  patientId?: number;
  examinationStatus?: MEDICO_RECORD_STATUS;
  paymentStatus?: MEDICO_PAYMENT_STATUS;
}
