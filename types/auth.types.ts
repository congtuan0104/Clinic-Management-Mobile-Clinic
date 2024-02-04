// Interface cho thông tin người dùng

// ModuleID:
// 1. Admin
// 2. Clinic
// 3. Patient
// 4. User

export interface IUserInfo {
  id: string;
  email: string;
  isInputPassword: boolean;
  gender?: number;
  birthday?: string;
  address?: string;
  phone?: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  moduleId: number;
}

// Interface xử lí đăng nhập

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUserInfo;
  token: string;
}

export interface ILoginWithGoogleRequest {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface ILoginResponseData {
  token: string;
  user: IUserInfo;
}

export interface ILoginWithGoogleResponse {
  data: {
    user: {
      email: string;
      emailVerified: boolean;
      id: string;
      password: string;
      role: string;
    };
    token: string;
  };
  message: string;
  status: string;
}

// Register

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  user: IUserInfo;
}

export interface ILinkAccountRequest {
  key: string | null;
  userId: string | null | undefined;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  provider: string | null;
}

export interface IResetPasswordResponse {
  message: string;
  status: boolean;
}

export interface IUserInfoUpdateForm {
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

export interface IUserInfoUpdateRequest {
  firstName: string;
  lastName: string;
  gender?: number | null;
  birthday?: string | null;
  address?: string | null;
  phone?: string | null;
  avatar?: string | null;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  isReset: string;
}

export interface IAddNewPasswordRequest {
  email: string;
  password: string;
}