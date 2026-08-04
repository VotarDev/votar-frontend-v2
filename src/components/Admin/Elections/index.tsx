import React from "react";
import AdminLayout from "../AdminLayout";
import { CiSearch } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import ElectionTables from "./ElectionTables";

const Elections = () => {
  return (
    <AdminLayout>
      <div className="max-w-[1300px] mx-auto py-8 lg:py-[60px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-xl font-bold lg:text-2xl">Elections</div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <div className="relative flex w-full items-center sm:w-[320px] lg:w-[380px]">
              <input
                type="text"
                name="search"
                placeholder="Search Elections...."
                className="h-[44px] w-full py-3 pl-12 pr-5 outline-none bg-[#FDFDFD] rounded-lg border border-slate-500"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                <CiSearch />
              </span>
            </div>
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded bg-blue-700 text-zinc-100 sm:w-40 shrink-0">
              <span>
                <AiOutlinePlus />
              </span>
              Create Election
            </button>
          </div>
        </div>
        <div className="pt-8 lg:pt-10">
          <ElectionTables />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Elections;
