import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

export const userProfileSlice = createSlice({
  name: "votarPlan",
  initialState,
  reducers: {
    userData: (state = initialState, action) => {
      state.user = action.payload;
    },
  },
});

export default userProfileSlice.reducer;
export const { userData } = userProfileSlice.actions;
