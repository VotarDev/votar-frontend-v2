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
import useForm from "@/utils/formValidation/useForm";

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
  return (
    <div className="h-screen w-full flex  justify-center px-4 bg-[#F6F6F7] overflow-auto">
      <div className="max-w-[28.15rem] mx-auto w-full">
        <div className="flex justify-center mb-10 mt-10">
          <img src={logo.src} alt="logo" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-xl leading-[1.4] pb-8">Login</div>
          <form className=" text-[#060606]">
            <div className="mb-10">
              <TextField
                variant="standard"
                label="Email"
                name="email"
                className="w-full"
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
                className="w-full"
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
