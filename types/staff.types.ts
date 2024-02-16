export interface IClinicMember {
  id: string;
  users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    gender: number;
    birthday: string;
  };

  role: {
    id: number;
    name: string;
  };
}

export interface IStaff {
  id: number;
  experience: number;
  description: string;
  specialize: string;
  clinicId: string;
  isDisabled: boolean;
  isAcceptInvite: boolean;
  users: {
    id: string;
    email: string;
    moduleId: number;
    avatar: string | null;
    firstName: string;
    phone: string;
    address: string;
    gender: number;
    birthday: string | null;
    lastName: string;
    isInputPassword: boolean;
    emailVerified: boolean;
    emailVerifiedAt: string;
    isDisabled: false;
    disabledAt: null;
    updatedAt: string;
    createdAt: string;
  };
  role: {
    id: number;
    name: string;
    permissions: IStaffPermission[];
  };
}

export interface IStaffPermission {
  id: number;
  optionName: string;
  isServiceOption: boolean;
}
