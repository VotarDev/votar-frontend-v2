import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import { useCurrentUser } from "@/utils/hooks";

const ProfileHeader = () => {
  const users = useCurrentUser();
  return (
    <div>
      <div className="flex justify-between items-center rounded p-4 box-shadow">
        <div className="text-xl font-semibold">Edit Profile</div>
        <div className="flex items-center gap-2">
          <div className="text-xl">
            <IoNotificationsOutline />
          </div>
          <div>
            <Avatar src="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
