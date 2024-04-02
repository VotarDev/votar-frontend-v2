import React from "react";
import AdminLayout from "../AdminLayout";
import { CiSearch } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import ElectionTables from "./ElectionTables";

const Elections = () => {
  return (
    <AdminLayout>
      <div className="max-w-[1300px] mx-auto pt-[60px]">
        <div className="flex justify-end">
          <div className="relative flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Search Elections...."
              className="lg:w-[429px] h-[44px] w-full py-3 pl-12 pr-5 outline-none bg-[#FDFDFD] rounded-lg border border-slate-500"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
              <CiSearch />
            </span>
          </div>
        </div>
        <div className="pt-10">
          <div>
            <button className="bg-blue-700 text-zinc-100 w-40 h-12 flex items-center justify-center gap-2 rounded">
              <span>
                <AiOutlinePlus />
              </span>
              Create Election
            </button>
          </div>
        </div>
        <div className="pt-10">
          <ElectionTables />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Elections;
