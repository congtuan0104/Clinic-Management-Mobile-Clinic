export interface IClinicInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  ownerId: string;
  address: string;
  logo: string;
  description: string;
  metadata: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptions: ISubscriptionsInClinicInfo[];
  userInClinics?: IUserInClinicInfo[];
}

export interface ISubscriptionsInClinicInfo {
  id: string;
  clinicId: string;
  planId: number;
  status: number;
  subcribedAt: string;
  expiredAt: string;
  unSubcribedAt: null | any;
  createdAt: string;
  updatedAt: string;
  isDisabled: boolean;
  disabledAt: null | any;
  plans: IPlanInSubscriptionInfo;
}

export interface IPlanInSubscriptionInfo {
  id: number;
  planName: string;
  currentPrice: number;
  duration: number;
  description: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface IClinicCreate {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description?: string;
  planId?: string;
}

export interface IUserInClinicInfo {
  role: {
    id: number;
    name: string;
  };
  isOwner: boolean;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IInviteClinicMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  clinicId: string;
}
