import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import InputSelect from "@/src/components/InputSelect";
import { IoIosArrowRoundForward } from "react-icons/io";
import { getElectionById, getForms } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { useRouter } from "next/router";
import { votarResponse } from "@/utils/api";
import { ElectionDetails, OptionTypes } from "@/utils/types";
import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";
import Header from "@/src/components/BallotPage/Header";
import Cookies from "universal-cookie";

const UsersForm = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [usersOption, setUsersOption] = useState<OptionTypes | null>(null);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [isFecthElection, setIsFetchElection] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const users = useCurrentUser();
  const router = useRouter();
  const cookies = new Cookies();
  const user = useUser();
  const { token, electionID } = router.query;
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
  });

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    const getElection = async () => {
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }
      // if (users?.data) {
      //   setAuthToken(users.data.data.cookie);
      // } else {
      //   if (typeof window !== "undefined") {
      //     const tokenLocal = localStorage.getItem("token");
      //     setAuthToken(tokenLocal);
      //   }
      // }
      setIsFetchElection(true);
      try {
        const electionData = { election_id: electionID };
        if (electionID) {
          const { data } = await getElectionById(electionData);

          if (data) {
            setElection(data.data);
            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchElection(false);
        toast.error("An error occured");
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    const getForm = async () => {
      // if (users?.data) {
      //   setAuthToken(users.data.data.cookie);
      // } else {
      //   if (typeof window !== "undefined") {
      //     const tokenLocal = localStorage.getItem("token");
      //     setAuthToken(tokenLocal);
      //   }
      // }
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }
      try {
        const { data } = await getForms(USER_ID);

        if (data) {
          console.log(
            data.data[data.data.length - 1].subgroup.map((item: any) => {
              return { value: item, label: item };
            })
          );
          console.log(data);
          setOptions(
            data.data[data.data.length - 1].subgroup.map((item: any) => {
              return { value: item, label: item };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getForm();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const formdata = new FormData(form);
    const data = {
      id: formdata.get("id"),
      name: formdata.get("name"),
      subgroup: usersOption?.value,
      phoneNumber: formdata.get("phone"),
      email: formdata.get("email"),
    };
    try {
      const response = await votarResponse(data, token as string);
      if (response.data) {
        setIsLoading(false);
        setSuccess(true);
        toast.success("Details Submitted Successfully");
        console.log(response.data);
        setFormData({
          id: "",
          name: "",
          phone: "",
          email: "",
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (isFecthElection)
    return (
      <div className="mt-10 flex items-center justify-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div>
      {isClient && (
        <>
          <Header electionDetails={election} />
          <div>
            <div className="text-xl text-center pt-5">
              <span className="font-bold">INSTRUCTION:</span> Please Fill in
              your Details Correctly
            </div>
            <form
              className="max-w-[1200px] mx-auto py-20"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
                  <label htmlFor="id">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
                  />
                </div>
                <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
                  />
                </div>
                <div className="border border-zinc-400 px-10 py-16 rounded-lg relative flex justify-between items-center">
                  <div className="flex-1">
                    <label htmlFor="subGroup">Sub-Group</label>
                    <InputSelect
                      placeholder={""}
                      setOption={setUsersOption}
                      option={options}
                      optionValue={usersOption}
                      className={
                        "lg:w-1/3 h-10 w-full placeholder:white cursor-pointer"
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
                  />
                </div>
                <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3 py-5">
                <button
                  className="p-4 h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded-lg gap-2 text-lg"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <CircularProgress
                      color="inherit"
                      className=" text-white"
                      size={20}
                    />
                  )}
                  Submit Details
                  <span className="text-3xl">
                    <IoIosArrowRoundForward />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersForm;
