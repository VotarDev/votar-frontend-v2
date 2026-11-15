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
import { invalidateOnWrite } from "./api/invalidateOnWrite";
import { handleSessionExpiry } from "./api/sessionExpiry";
import httpService from "@/utils/axios";

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

// Refresh cached data after writes made through the old axios calls.
invalidateOnWrite(httpService, store.dispatch);
// Sign out (and go to sign in) when the API rejects an expired token.
handleSessionExpiry(httpService, store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
