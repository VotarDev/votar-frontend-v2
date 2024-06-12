import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface voterProfileState {
  loading: boolean;
  userData: any;
  isVerified: boolean;
}

const initialState: voterProfileState = {
  loading: false,
  userData: null,
  isVerified: false,
};

const voterProfileSlice = createSlice({
  name: "voterProfile",
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<any>) => {
      state.userData = payload;
      state.loading = false;
      state.isVerified = true;
    },
    logout: (state) => {
      state.userData = null;
      state.loading = false;
      state.isVerified = false;
    },
    initializeFromLocalStorage: (state, { payload }: PayloadAction<any>) => {
      state.userData = payload.userData;
      state.loading = payload.loading;
      state.isVerified = payload.isVerified;
    },
  },
});
export const { login, logout, initializeFromLocalStorage } =
  voterProfileSlice.actions;

export default voterProfileSlice.reducer;
