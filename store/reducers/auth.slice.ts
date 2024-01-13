import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ILoginResponse, IUserInfo } from "../../types";

interface AuthState {
  user: IUserInfo | null;
  token: string | null;
}

// define initial state
const initialState: AuthState = {
  user: null,
  token: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    login: (state, action: PayloadAction<ILoginResponse>) => {
      (state.user = action.payload.user), (state.token = action.payload.token);
    },
    restoreUserInfo: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, restoreUserInfo, logout } = AuthSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.

export const authReducer = AuthSlice.reducer;
export const userInfoSelector = (state: RootState) => state?.authReducer?.user;
export const tokenInfoSelector = (state: RootState) =>
  state?.authReducer?.token;
