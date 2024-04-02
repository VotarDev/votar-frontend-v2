import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import votarPlanSliceReducer from "./features/votarPlan/votarPlanSlice";
import userProfileSliceReducer from "./features/userProfile/userProfileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    votarPlan: votarPlanSliceReducer,
    userProfile: userProfileSliceReducer,
  },
});

export default store;
