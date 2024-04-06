import React, { FormEvent, useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/router";
import Button from "@/src/components/HomePage/Button";
import google from "../../public/assets/logos/google.svg";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import {
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { googleAuth } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import { useCurrentUser } from "@/utils/hooks";
import useForm from "@/utils/formValidation/useForm";

const SigninComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, userData, error, success, message } = useSelector(
    (state: any) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useCurrentUser();
  const { data } = useSession();

  const eyeHanlder = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (success) router.push("/dashboard");
  }, [success, router]);

  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userdata = { email, password };
    //@ts-ignore
    dispatch(login(userdata));
    console.log(message);
  };

  const googleAuthHandler = async () => {
    // setIsLoading(true);
    // try {
    //   const { data } = await googleAuth();

    //   if (data) {
    //     router.push("/dashboard");
    //   }
    //   setIsLoading(false);
    // } catch (error: any) {
    //   console.log(error);
    // }
    const url = process.env.NEXT_PUBLIC_URL;
    console.log(url);
    signIn("google", { callbackUrl: `${url}/dashboard` });
  };
  const { handleChange, values, errors, handleSubmit } = useForm(loginHandler);
  //@ts-ignore
  const { email, password } = values;
  // console.log(data);

  return (
    <div className="flex justify-center items-center flex-col lg:my-0 my-8 lg:py-0 lg:w-[30vw] w-[80vw]">
      <form className="w-full text-[#060606]" onSubmit={loginHandler}>
        <div className="mb-5">
          <TextField
            variant="standard"
            label="Email"
            onChange={handleChange}
            name="email"
            value={email}
            error={errors["email"] ? true : false}
            helperText={errors["email"]}
            className="w-full"
            InputLabelProps={{
              style: {
                color: "#bfbfbf",
              },
            }}
          />
        </div>

        <div className="mb-5 relative">
          <TextField
            variant="standard"
            label="Password"
            onChange={handleChange}
            name="password"
            value={password}
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
        <div className="flex items-center justify-between text-[#454545]">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  style={{
                    marginTop: 0,
                    marginBottom: 0,
                    color: "#015CE9",
                  }}
                />
              }
              label="Remember me"
            />
          </FormGroup>
          <div>Forgot Password</div>
        </div>
      </form>

      <button
        className=" border border-[#015CE9] h-[52px] rounded mt-5 w-full text-[#454545] font-proximaNova flex justify-center items-center"
        onClick={googleAuthHandler}
        disabled={loading ? true : false}
      >
        <span className="flex items-center gap-4">
          <img src={google.src} alt="google" />
          Sign in with google
        </span>
      </button>
    </div>
  );
};

export default SigninComponent;
