import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";

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
  loading: false,
  userData: users ? users : null,
  userToken: null,
  error: false,
  success: false,
  message: "",
};

//login user

export const login = createAsyncThunk(
  `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
  async (userdata, thunkAPI) => {
    try {
      const { data } = await authService.login(userdata);
      if (data) {
        setAuthToken(data.data.data.cookie);
        localStorage.setItem("user", JSON.stringify(data));
        toast.success(data.data?.message);
        console.log(data.data.data.cookie);
      }
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(error.response.data.message || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// register user

export const register = createAsyncThunk(
  `${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`,
  async (userdata, thunkAPI) => {
    try {
      const { data } = await authService.signup(userdata);
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success(data.data?.message);
      }
      console.log(data);
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error);
      toast.error(error.response.data.message || error.message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.error = false;
      state.success = false;
      state.loading = false;
    },
    logout: (state) => {
      state.userData = null;
      state.error = false;
      state.success = false;
      state.loading = false;
    },
    setCredentials: (state, { payload }) => {
      state.userData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = true;
        //@ts-ignore
        state.userData = action.payload;
        state.userToken = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.userData = null;
        state.userToken = null;
        state.message = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.userData = null;
      });
  },
});

export default authSlice.reducer;
export const { reset, logout } = authSlice.actions;
