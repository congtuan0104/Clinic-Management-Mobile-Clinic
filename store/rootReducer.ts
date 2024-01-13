import { combineReducers } from "@reduxjs/toolkit";

import * as reducers from "./reducers";

const { commonReducer } = reducers;
const { authReducer } = reducers;
const { clinicReducer } = reducers;
const { rolesReducer } = reducers;
export const rootReducer = combineReducers({
  commonReducer,
  authReducer,
  clinicReducer,
  rolesReducer,
});
