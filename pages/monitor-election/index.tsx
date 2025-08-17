import React, { useState, useEffect } from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import MonitorAnElection from "@/src/components/MonitorAnElection";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { getElections } from "@/utils/api";
import { ElectionDetails } from "@/utils/types";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";

const MonitorElection = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [elections, setElections] = useState<ElectionDetails[]>([]);
  const [isFetchElections, setIsFetchElections] = useState(false);
  const cookies = new Cookies();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    setIsFetchElections(true);
    const getElectionsData = async () => {
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }
      try {
        const { data } = await getElections(USER_ID);
        if (data) {
          setElections(data.data);
          setIsFetchElections(false);
        }
      } catch (error) {
        console.log(error);
        setIsFetchElections(false);
      }
    };
    getElectionsData();
  }, []);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <MonitorAnElection
          elections={elections}
          isFetchElections={isFetchElections}
        />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default MonitorElection;
