import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  votarPlan: "",
};

export const votarPlanSlice = createSlice({
  name: "votarPlan",
  initialState,
  reducers: {
    selected_plan: (state = initialState, action) => {
      state.votarPlan = action.payload;
    },
  },
});

export default votarPlanSlice.reducer;
export const { selected_plan } = votarPlanSlice.actions;
