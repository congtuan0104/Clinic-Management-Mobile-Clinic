import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IStaff} from "../../types";

interface StaffState {
  staff: IStaff | null;
}

// define initial state
const initialState: StaffState = {
  staff: null,
};

export const StaffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<IStaff>) => {
        state.staff = action.payload;     
    },
    
  },
});

export const { setStaff } = StaffSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.

export const staffReducer = StaffSlice.reducer;
export const StaffSelector = (state: RootState) => state?.staffReducer.staff;
