import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  available: boolean;
  data?: {
    username: string;
    password: string;
  };
  tested: boolean;
  loading: boolean;
}

const initialState: AdminState = {
  available: false,
  data:
    typeof window !== "undefined" && localStorage.getItem("adminData")
      ? JSON.parse(localStorage.getItem("adminData") as string)
      : undefined,
  tested: false,
  loading: true,
};

const AdminSlice = createSlice({
  name: "Admin",
  initialState,
  reducers: {
    setAdminData: (state, { payload }) => {
      state.data = payload;
      state.tested = true;
      state.available = true;
      state.loading = false;
      // Save admin data to local storage
      const { id, username, password } = payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "adminData",
          JSON.stringify({ id, username, password })
        );
      }
    },

    setAdminTest: (state, { payload }) => {
      state.tested = payload;
      state.loading = false;
    },

    setAdminLoading: (state, { payload }) => {
      state.loading = payload;
    },

    removeAdminData: (state) => {
      state.data = undefined;
      state.available = false;
      state.loading = false;
      state.tested = true;
      // Remove admin data from local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminData");
      }
    },
  },
});
export default AdminSlice.reducer;
export const { setAdminData, setAdminTest, removeAdminData, setAdminLoading } =
  AdminSlice.actions;
