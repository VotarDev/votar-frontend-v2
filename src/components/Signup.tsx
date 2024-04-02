import React, { useState, useEffect } from "react";
import Button from "@/src/components/HomePage/Button";
import google from "../../public/assets/logos/google.svg";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import useForm from "@/utils/formValidation/useForm";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/router";
import { googleAuth } from "@/utils/api";

import {
  TextField,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { signIn } from "next-auth/react";

const SignupComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowcpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loading, userData, error, success, message } = useSelector(
    (state: any) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const eyeHanlder = () => {
    setShowPassword(!showPassword);
  };

  const confirmHandler = () => {
    setShowcpassword(!showCPassword);
  };

  useEffect(() => {
    if (success) router.push("/dashboard");
  }, [success, router]);

  const signUpHandler = async () => {
    // setIsLoading(true);
    const userData = { name, username, email, password };
    // console.log(userData);

    //@ts-ignore
    dispatch(register(userData));
  };

  const googleAuthHandler = async () => {
    // const url = process.env.NEXT_PUBLIC_URL;
    // console.log(url);
    // signIn("google", { callbackUrl: `${url}/dashboard` });
    try {
      const data = await googleAuth();
      if (!data) {
        throw new Error("Failed to sign in with Google");
      }
      router.replace("/dashboard");
    } catch (e: any) {
      console.log(e);
    }
  };

  const { handleChange, values, errors, handleSubmit } = useForm(signUpHandler);
  // console.log(values);

  //@ts-ignore
  const { name, username, email, password } = values;

  return (
    <div className="flex justify-center items-center flex-col lg:my-0 my-8 lg:py-0 lg:w-[30vw] w-full font-proximaNova">
      <form onSubmit={handleSubmit} className="flex flex-col w-full ">
        <div className="flex gap-2 mb-5">
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
        <div className="mb-5">
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
        <div className="mb-5">
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
        <div className="mb-5 relative">
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
        <div className="mb-5 relative">
          <TextField
            variant="standard"
            label={"Confirm Password "}
            onChange={handleChange}
            name="confirm password"
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
        <div className="mb-5">
          <TextField
            variant="standard"
            label="Referrer (Optional)"
            onChange={handleChange}
            name="referral"
            className="w-full"
            InputLabelProps={{
              style: { color: "#bfbfbf" },
            }}
          />
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
          className="bg-[#015CE9] text-white h-[52px] rounded mt-3 flex items-center justify-center gap-2 font-proximaNova transition ease-out duration-150 hover:scale-[1.03]"
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

      <button className="my-3 border border-[#015CE9] h-[52px] rounded mt-7 w-full text-[#454545] font-proximaNova flex items-center justify-center">
        <span className="flex items-center gap-4" onClick={googleAuthHandler}>
          <img src={google.src} alt="google" />
          Sign up with google
        </span>
      </button>
    </div>
  );
};

export default SignupComponent;
