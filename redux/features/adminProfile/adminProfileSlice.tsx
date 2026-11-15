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

// Older versions saved the admin's password here; drop it.
if (typeof window !== "undefined") {
  try {
    const saved = JSON.parse(localStorage.getItem("adminData") || "null");
    if (saved && "password" in saved) {
      delete saved.password;
      localStorage.setItem("adminData", JSON.stringify(saved));
    }
  } catch {
    localStorage.removeItem("adminData");
  }
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
      // Save who's signed in (never the password) to local storage.
      const { id, username } = payload || {};
      if (typeof window !== "undefined") {
        localStorage.setItem("adminData", JSON.stringify({ id, username }));
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
