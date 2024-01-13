import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IRole } from "../../types/role.types";

interface RolesState {
  roles: IRole[] | null;
}

// define initial state
const initialState: RolesState = {
  roles: null,
};

export const RolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRoles: (state, action: PayloadAction<IRole>) => {
      if (state.roles) {
        state.roles.push(action.payload);
      } else {
        state.roles = [action.payload];
      }
    },
    changeRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload;
    },
  },
});

export const { addRoles, changeRoles } = RolesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.

export const rolesReducer = RolesSlice.reducer;
export const RolesSelector = (state: RootState) => state?.rolesReducer.roles;
