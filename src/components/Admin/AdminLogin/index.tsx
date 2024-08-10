import React, { FormEvent, useState } from "react";
import logo from "../../../../public/assets/logos/votar-logo.svg";
import {
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "universal-cookie";
import { adminLogin } from "@/utils/api";
import { useDispatch } from "react-redux";
import { setAdminData } from "@/redux/features/adminProfile/adminProfileSlice";
import useForm from "@/utils/formValidation/useForm";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ro } from "date-fns/locale";

const Login = () => {
  const useOutlinedInputStyles = makeStyles({
    root: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "red",
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cookies = new Cookies();
    setLoading(true);
    try {
      const { data } = await adminLogin({ username, password });
      if (data) {
        console.log(data.data.token);
        cookies.set("admin-token", data.data.token, { path: "/" });
        dispatch(setAdminData(data.data));
        toast.success("Login successful");
        router.push("/admin");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full flex  justify-center px-4 bg-[#F6F6F7] overflow-auto">
      <div className="max-w-[28.15rem] mx-auto w-full">
        <div className="flex justify-center mb-10 mt-10">
          <img src={logo.src} alt="logo" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-xl leading-[1.4] pb-8">Login</div>
          <form className=" text-[#060606]" onSubmit={handleLogin}>
            <div className="mb-10">
              <TextField
                variant="standard"
                label="Username"
                name="username"
                className="w-full"
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                  style: {
                    color: "#bfbfbf",
                  },
                }}
              />
            </div>

            <div className="mb-10 relative">
              <TextField
                variant="standard"
                label="Password"
                name="password"
                type="password"
                className="w-full"
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: "#bfbfbf" },
                }}
              />
            </div>

            <button
              className="bg-[#015CE9] text-white h-[52px] rounded mt-7 flex items-center justify-center gap-2 font-proximaNova w-full transition ease-out duration-150 hover:scale-[1.03]"
              disabled={loading}
            >
              {loading && (
                <CircularProgress
                  color="inherit"
                  className="ml-[-2rem]"
                  size={20}
                />
              )}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
