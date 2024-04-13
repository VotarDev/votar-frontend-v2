import { createSlice } from "@reduxjs/toolkit";

let users = null;

if (typeof window !== "undefined") {
  const userObject = localStorage.getItem("user");
  if (userObject) {
    users = JSON.parse(userObject);
  } else {
    users = null;
  }
}

const initialState = {
  user: users ? users : {},
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
