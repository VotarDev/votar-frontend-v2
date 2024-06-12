import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import votarPlanSliceReducer from "./features/votarPlan/votarPlanSlice";
import userProfileSliceReducer from "./features/userProfile/userProfileSlice";
import voterProfilesReducer from "./features/auth/voterLoginSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    votarPlan: votarPlanSliceReducer,
    userProfile: userProfileSliceReducer,
    voterProfile: voterProfilesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
