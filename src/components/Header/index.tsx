import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useUser } from "@/utils/hooks";

import { BiMessageSquareDetail } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const Header = () => {
  const user = useUser();
  const { data } = useSession();
  return (
    <div className="absolute w-full flex h-[75px] border-b border-[#8E8E8E] items-center lg:px-[51px] px-4 justify-between flex-wrap">
      <div className="lg:text-2xl font-semibold text-base capitalize">
        Welcome,{" "}
        <span>
          {user.user && <>{user.user.data.userName}</>}
          {/* {data && data?.user?.name?.split(" ")[0]} */}
        </span>
        {/* {users && users.user.username
          ? users.user.username.split(" ")[0]
          : data?.user?.name?.split(" ")[0]} */}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative md:flex items-center hidden">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="lg:w-[429px] h-[44px] w-full py-3 pl-12 pr-5 outline-none bg-[#FDFDFD] rounded-lg"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
            <CiSearch />
          </span>
        </div>
        <div className="lg:p-3 p-2 border border-[rgba(0, 0, 0, 0.10)] rounded-xl bg-[#fdfdfd] flex items-center justify-center lg:text-xl text-base cursor-pointer">
          <span>
            <BiMessageSquareDetail />
          </span>
        </div>
        <div className="lg:p-3 p-2 border border-[rgba(0, 0, 0, 0.10)] rounded-xl bg-[#fdfdfd] flex items-center justify-center font-bold lg:text-xl text-base cursor-pointer">
          <span>
            <IoNotificationsOutline />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
