import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import authService from "./authService";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

type AuthUser = Record<string, unknown>;

interface AuthState {
  loading: boolean;
  userData: AuthUser | null;
  isVerified: boolean;
  userToken: string | null;
  error: boolean;
  success: boolean;
  message: string;
}

interface AuthApiResponse {
  message?: string;
  token?: string;
  data?: {
    message?: string;
    data?: {
      cookie?: string;
      token?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface SignupPayload {
  NIN: number;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  try {
    const userObject = localStorage.getItem("user");
    return userObject ? (JSON.parse(userObject) as AuthUser) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  loading: false,
  userData: getStoredUser(),
  isVerified: false,
  userToken: null,
  error: false,
  success: false,
  message: "",
};

const getRequestErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : "The request could not be completed. Please try again.";
  }

  const body = error?.response?.data;
  const message =
    body?.message ||
    body?.data?.message ||
    body?.error ||
    error?.message ||
    "The request could not be completed. Please try again.";
  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "Could not reach the Votar API. Check the API URL and that the backend is running.";
  }
  return typeof message === "string" ? message : JSON.stringify(message);
};

//login user

export const login = createAsyncThunk<
  AuthApiResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
  async (userdata: { email: string; password: string }, thunkAPI) => {
    try {
      const cookies = new Cookies();
      const { data } = await authService.login(userdata);
      if (data) {
        setAuthToken(data.data.data.cookie);
        localStorage.setItem("user", JSON.stringify(data));
        cookies.set("user-token", data.data.data.cookie, {
          path: "/",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        // localStorage.setItem("token", data.data.data.cookie);
        toast.success(data.data?.message);
      }
      return data;
    } catch (error: unknown) {
      const message = getRequestErrorMessage(error);
      if (
        (axios.isAxiosError(error) && error.response?.status === 403) &&
        message ===
          "Email not verified. A new verification code has been sent to your email."
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({ data: { data: { email: userdata.email } } })
        );
        toast.error(message);
        window.location.href = "/signin/otp";
      } else {
        toast.error(message);
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// register user

export const register = createAsyncThunk<
  AuthApiResponse,
  SignupPayload,
  { rejectValue: string }
>(
  `${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`,
  async (userdata, thunkAPI) => {
    try {
      const { data } = await authService.signup(userdata);

      if (data) {
        const signupDetails = data.data?.data;
        const responseMessage = data.data?.message ?? "Account created.";

        if (signupDetails?.verificationEmailQueued === false) {
          toast.error(responseMessage);
          return data;
        }

        localStorage.setItem("user", JSON.stringify(data));
        toast.success(responseMessage);
        window.location.href = "/signin/otp";
      }
      return data;
    } catch (error: unknown) {
      const message = getRequestErrorMessage(error);
      toast.error(message);
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
    googleAuth: (state, { payload }: PayloadAction<AuthUser | null>) => {
      state.userData = payload;
    },
    setCredentials: (state, { payload }: PayloadAction<AuthUser | null>) => {
      state.userData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isVerified = true;
        state.userData = action.payload;
        state.userToken =
          action.payload.data?.data?.cookie ??
          action.payload.data?.data?.token ??
          action.payload.token ??
          null;
        state.message =
          action.payload.data?.message ?? action.payload.message ?? "";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.isVerified = false;
        state.success = false;
        state.userData = null;
        state.userToken = null;
        state.message =
          action.payload ?? action.error.message ?? "Login failed.";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isVerified = false;
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
        state.message =
          action.payload.data?.message ?? action.payload.message ?? "";
        state.error = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isVerified = false;
        state.loading = false;
        state.error = true;
        state.success = false;
        state.userData = null;
        state.message =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "Signup failed.";
      });
  },
});

export default authSlice.reducer;
export const { reset, logout, googleAuth, setCredentials } = authSlice.actions;
