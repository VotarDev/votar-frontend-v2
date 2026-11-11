import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import votarPlanSliceReducer from "./features/votarPlan/votarPlanSlice";
import userProfileSliceReducer from "./features/userProfile/userProfileSlice";
import voterProfilesReducer from "./features/auth/voterLoginSlice";
import adminSlice from "./features/adminProfile/adminProfileSlice";
import cardFormReducer from "./features/cardDetailsForm/cardDetailsSlice";
import votarCreditReducer from "./features/votarCredit/votarCreditSlice";
import creditSliceReducer from "./features/creditSlice/creditSlice";
import { baseApi } from "./api/baseApi";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    votarPlan: votarPlanSliceReducer,
    userProfile: userProfileSliceReducer,
    voterProfile: voterProfilesReducer,
    admin: adminSlice,
    cardForm: cardFormReducer,
    votarCredit: votarCreditReducer,
    credit: creditSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
