import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserData } from "@/utils/api";
import { useCurrentUser } from "@/utils/hooks";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import setAuthToken from "@/utils/setAuthToken";

const FetchAppData = () => {
  const user = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      if (user) setAuthToken(user.data.data.cookie);

      try {
        const userId = user.data.data._id ? user.data.data._id : user.data.data;
        const { data } = await getUserData(userId);

        if (data) {
          dispatch(userData(data));
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getUser();
  }, [dispatch, user]);
  return <></>;
};

export default FetchAppData;
