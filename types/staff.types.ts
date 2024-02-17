import { Gender } from '../enums';
import { IRole, IUserInfo } from '.';

export interface IClinicMember {
  id: string;
  users: 
  {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    gender: number;
    birthday: string;
  } | null;
  
  role: {
    id: number;
    name: string;
  };
}

export interface IStaffQueryParams {
  userId?: string;
  roleId?: string;
  clinicId?: string;
  gender?: number;
  phoneNumber?: string;
  email?: string;
  name?: string;
  isDisabled?: boolean;
  isAcceptInvite?: boolean;
}

export interface IClinicStaff {
  id: number;
  experience?: number;
  description?: string;
  specialize?: string;
  users: IUserInfo | null;
  role: IRole;
  isAcceptInvite: boolean;
  isDisabled: boolean;
}

export interface IClinicStaffDetail {
  id?: number;
  memberId?: number;
  specialize?: string;
  experience?: number;
  phoneNumber?: string;
  address?: string;
  gender?: number;
  createdAt?: string;
  updatedAt?: string;
  isDisabled?: boolean;
  avatar?: string;
  disabledAt?: string;
  userId?: string;
  clinicId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ICreateStaffPayload {
  userInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    gender?: Gender;
    birthday?: Date;
  };
  userId?: string;
  clinicId: string;
  roleId: number;
  specialize?: string;
  experience?: number;
  description?: string;
  services?: number[];
}

