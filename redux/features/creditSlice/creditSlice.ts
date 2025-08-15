import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  credit: null,
  isLoaded: false,
};

const creditSlice = createSlice({
  name: "credit",
  initialState,
  reducers: {
    setCredit(state, action) {
      state.credit = action.payload;
    },
    setCreditLoaded(state, action) {
      state.isLoaded = action.payload;
    },
  },
});

export const { setCredit, setCreditLoaded } = creditSlice.actions;
export default creditSlice.reducer;
