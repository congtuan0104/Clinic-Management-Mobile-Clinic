import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IClinicInfo } from "../../types/clinic.types";

interface ClinicState {
  clinic: IClinicInfo | null;
}

// define initial state
const initialState: ClinicState = {
  clinic: null,
};

export const ClinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    updateClinic: (state, action: PayloadAction<any>) => {
      state.clinic = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // login: (state, action: PayloadAction<ILoginResponse>) => {
    //   (state.user = action.payload.user), (state.token = action.payload.token);
    // },
    // restoreUserInfo: (state, action: PayloadAction<ILoginResponse>) => {
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    // },
    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    // },
  },
});

export const { updateClinic } = ClinicSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.

export const clinicReducer = ClinicSlice.reducer;
export const ClinicSelector = (state: RootState) => state?.clinicReducer.clinic;
