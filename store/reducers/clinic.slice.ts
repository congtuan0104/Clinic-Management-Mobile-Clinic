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
    updateClinic: (state, action: PayloadAction<IClinicInfo>) => {
      if (state.clinic) {
        state.clinic.name = action.payload.name;
        state.clinic.address = action.payload.address;
        state.clinic.email = action.payload.email;
        state.clinic.phone = action.payload.phone;
        state.clinic.logo = action.payload.logo;
        state.clinic.description = action.payload.description;
        state.clinic.lat = action.payload.lat;
        state.clinic.long = action.payload.long;
      }
    },
    changeClinic: (state, action: PayloadAction<IClinicInfo>) => {
      state.clinic = action.payload;
    },
    deleteClinic: (state) => {
      state.clinic = null;
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

export const { updateClinic, changeClinic, deleteClinic } = ClinicSlice.actions;

export const clinicReducer = ClinicSlice.reducer;
export const ClinicSelector = (state: RootState) => state?.clinicReducer.clinic;
