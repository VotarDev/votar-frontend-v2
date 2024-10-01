import React, { useState } from "react";
import { voterLogin } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { voterLoginCookieName } from "@/src/__env";
import { useRouter } from "next/router";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { login } from "@/redux/features/auth/voterLoginSlice";

const ElectionId = ({ electionId }: { electionId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const bodyData = { election_id: electionId, access_id: accessCode };
      const { data } = await voterLogin(bodyData);
      const cookie = new Cookies();
      cookie.set(voterLoginCookieName, data.data.token, { path: "/" });
      if (data) {
        setIsLoading(false);
        const voterData = {
          userData: data.data.user,
          loading: false,
          isVerified: true,
        };
        toast.success("Login Successful");
        router.push(`/ballot`);
        dispatch(login(voterData));
        localStorage.setItem("voterProfile", JSON.stringify(voterData));

        console.log(data.data);
      }
    } catch (error: any) {
      console.log(error);
      toast.error("An error occured");
      setIsLoading(false);
    }
  };
  return (
    <div className="lg:my-[100px] text-center my-[50px] px-4 lg:px-0 max-w-[30rem] mx-auto lg:max-w-full">
      <div className="lg:text-2xl font-bold text-xl">
        Please enter your Access code to gain Authorization To your secret
        <br /> ballot for the Association of Political Science Analyst Election
      </div>
      <div>
        <form
          onSubmit={onSubmit}
          className="w-full flex lg:items-center lg:mt-[40px] mt-7 gap-4 flex-col lg:flex-row justify-center"
        >
          <div>
            <input
              type="text"
              placeholder="Enter Your Access Code"
              onChange={(e) => setAccessCode(e.target.value)}
              className="border-[2px] border-[#B4B4B4] lg:w-[585px] h-[52px] outline-none p-4 rounded w-full"
            />
          </div>
          <div>
            <button
              disabled={isLoading}
              className="h-[52px] bg-[#015CE9] text-white font-proximaNova rounded outline-none lg:w-[141px] w-full flex items-center justify-center"
            >
              Sign in
              {isLoading && (
                <CircularProgress
                  size={20}
                  style={{ color: "#fff" }}
                  className="ml-2"
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElectionId;
