import React, { useEffect, useState } from "react";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import InputSelect from "@/src/components/InputSelect";
import { IoIosArrowRoundForward } from "react-icons/io";
import { getForms } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";

const UsersForm = () => {
  const [options, setOptions] = useState<string[]>([]);
  const users = useCurrentUser();
  const user = useUser();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    const getForm = async () => {
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        const { data } = await getForms(USER_ID);
        if (data) {
          console.log(
            data.data[data.data.length - 1].subgroup.map((item: any) => {
              return { value: item, label: item };
            })
          );
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
  return (
    <div>
      <ElectionHeader electionTitle="NATIONAL ASSOCIATION OF POLITICAL SCIENCE STUDENTS" />
      <div>
        <div className="text-xl text-center pt-5">
          <span className="font-bold">INSTRUCTION:</span> Please Fill in your
          Details Correctly
        </div>
        <form className="max-w-[1200px] mx-auto py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
              <label htmlFor="id">ID</label>
              <input
                type="text"
                name="id"
                className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
              />
            </div>
            <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
              />
            </div>
            <div className="border border-zinc-400 px-10 py-16 rounded-lg relative flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="subGroup">Sub-Group</label>
                <InputSelect
                  placeholder={""}
                  option={options}
                  optionValue={""}
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
                className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
              />
            </div>
            <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3 py-5">
            <button className="p-4 h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded-lg gap-2 text-lg">
              Submit Details
              <span className="text-3xl">
                <IoIosArrowRoundForward />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersForm;
