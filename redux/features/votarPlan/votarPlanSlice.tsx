import { createSlice } from "@reduxjs/toolkit";

let plans = null;

if (typeof window !== "undefined") {
  const voterPlan = localStorage.getItem("votar plan");
  if (voterPlan) {
    plans = JSON.parse(voterPlan);
  } else {
    plans = null;
  }
}

const initialState = {
  votarPlan: plans ? plans : null,
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
