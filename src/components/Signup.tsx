import React, { useState, useEffect } from "react";
import Button from "@/src/components/HomePage/Button";
import google from "../../public/assets/logos/google.svg";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import useForm from "@/utils/formValidation/useForm";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/router";
import { googleAuthentication } from "@/utils/api";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

import {
  TextField,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { signIn } from "next-auth/react";
import axios from "axios";
import authService from "@/redux/features/auth/authService";

import { toast } from "react-hot-toast";

const SignupComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowcpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // const { loading, userData, error, success, message } = useSelector(
  //   (state: any) => state.auth
  // );
  const dispatch = useDispatch();
  const router = useRouter();

  const eyeHanlder = () => {
    setShowPassword(!showPassword);
  };

  const confirmHandler = () => {
    setShowcpassword(!showCPassword);
  };

  const signUpHandler = async () => {
    setLoading(true);
    const userData = {
      NIN: 123456,
      userName: username,
      phoneNumber,
      email,
      password,
      confirmPassword,
    };
    // console.log(userData);

    //@ts-ignore
    try {
      const { data } = await authService.signup(userData);
      if (data) {
        setIsLoading(false);
        router.push("/signin/otp");
        toast.success(data.data?.message);
      }
    } catch (e: any) {
      toast.error(e.response.data.message || e.message);
    }
  };

  // const googleLogin = useGoogleLogin({
  //   flow: "auth-code",
  //   onSuccess: async (codeResponse) => {
  //     console.log(codeResponse);
  //     const tokens = await axios.post(
  //       "https://votar-api.onrender.com/app:v1/auth/google",
  //       {
  //         code: codeResponse.code,
  //       }
  //     );
  //     const userData = {
  //       NIN: 123456,
  //       userName: username,
  //       phoneNumber,
  //       email,
  //       password,
  //       confirmPassword,
  //     };
  //     const tokens = await googleAuthentication(userData);

  //     console.log(tokens);
  //   },
  //   onError: (errorResponse) => console.log(errorResponse),
  // });

  const googleAuthHandler = async () => {
    // const url = process.env.NEXT_PUBLIC_URL;
    // console.log(url);
    // signIn("google", { callbackUrl: `${url}/dashboard` });
    const userData = {
      NIN: 123456,
      userName: username,
      phoneNumber,
      email,
      password,
      confirmPassword,
    };
    try {
      setIsLoading(true);
      const data = await googleAuthentication(userData);
      console.log(data);
      // if (data && data.data) {
      //   // Redirect the user to the Google authentication URL
      //   window.location.href = data.data;
      // } else {
      //   console.error("Google authentication failed");
      // }
      setIsLoading(false);
      console.log(data.data);
    } catch (e: any) {
      console.log(e);
    }
  };

  const { handleChange, values, errors, handleSubmit } = useForm(signUpHandler);
  // console.log(values);

  //@ts-ignore
  const { name, username, email, phoneNumber, password, confirmPassword } =
    values;

  return (
    <div className="flex justify-center items-center flex-col lg:my-0 my-8 lg:py-0 lg:w-[30vw] w-full font-proximaNova">
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
        <div className="flex gap-2">
          <TextField
            variant="standard"
            label="Firstname"
            onChange={handleChange}
            name="name"
            value={name}
            error={errors["firstname"] ? true : false}
            helperText={errors["firstname"]}
            className="w-full"
            InputLabelProps={{
              style: {
                color: "#bfbfbf",
              },
            }}
          />
          <TextField
            variant="standard"
            label="Lastname"
            onChange={handleChange}
            name="lastname"
            error={errors["lastname"] ? true : false}
            helperText={errors["lastname"]}
            className="w-full"
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
        </div>
        <div className="">
          <TextField
            variant="standard"
            label="Email"
            onChange={handleChange}
            value={email}
            name="email"
            error={errors["email"] ? true : false}
            helperText={errors["email"]}
            className="w-full"
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
        </div>
        <div className="">
          <TextField
            variant="standard"
            label="Username"
            onChange={handleChange}
            value={username}
            name="username"
            error={errors["username"] ? true : false}
            helperText={errors["username"]}
            className="w-full"
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
        </div>
        <div className="">
          <TextField
            variant="standard"
            label="Phone Number"
            onChange={handleChange}
            value={phoneNumber}
            name="phoneNumber"
            error={errors["phoneNumber"] ? true : false}
            helperText={errors["phoneNumber"]}
            className="w-full"
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
        </div>
        <div className="relative">
          <TextField
            variant="standard"
            label="Password"
            onChange={handleChange}
            value={password}
            name="password"
            error={errors["password"] ? true : false}
            helperText={errors["password"]}
            className="w-full"
            type={showPassword ? "text" : "password"}
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
          <span
            className="absolute right-1 top-[51%] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
            onClick={eyeHanlder}
          >
            {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
          </span>
        </div>
        <div className=" relative">
          <TextField
            variant="standard"
            label={"Confirm Password "}
            onChange={handleChange}
            name="confirmPassword"
            value={confirmPassword}
            error={errors["confirmPassword"] ? true : false}
            helperText={errors["confirmPassword"]}
            className="w-full text-sm"
            type={showCPassword ? "text" : "password"}
            InputLabelProps={{
              style: { color: "#bfbfbf", fontFamily: "proxima, sans-serif" },
            }}
          />
          <span
            className="absolute right-1 top-[51%] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
            onClick={confirmHandler}
          >
            {showCPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
          </span>
        </div>
        <div className="text-[#454545]">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  required
                  inputProps={{ "aria-label": "controlled" }}
                  sx={{
                    color: "#848484",
                    "&.Mui-checked": {
                      color: "#015CE9",
                    },
                  }}
                />
              }
              label="
              Accept privacy policy"
            />
          </FormGroup>
        </div>

        <button
          className="bg-[#015CE9] text-white h-[52px] rounded flex items-center justify-center gap-2 font-proximaNova transition ease-out duration-150 hover:scale-[1.03]"
          disabled={loading}
        >
          {loading && (
            <CircularProgress
              color="inherit"
              className="ml-[-2rem]"
              size={20}
            />
          )}
          Sign Up
        </button>
      </form>

      <button
        className=" border border-[#015CE9] h-[52px] rounded mt-7 w-full text-[#454545] font-proximaNova flex items-center justify-center gap-3"
        disabled={isLoading}
      >
        {isLoading && (
          <CircularProgress
            color="primary"
            className="ml-[-2rem] text-blue-700"
            size={20}
          />
        )}
        <span className="flex items-center gap-4" onClick={googleAuthHandler}>
          <img src={google.src} alt="google" />
          Sign up with google
        </span>
      </button>
    </div>
  );
};

export default SignupComponent;
