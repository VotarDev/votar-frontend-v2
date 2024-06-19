import React, { useState, useEffect } from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import MonitorAnElection from "@/src/components/MonitorAnElection";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { getElections } from "@/utils/api";
import { ElectionDetails } from "@/utils/types";

const MonitorElection = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [elections, setElections] = useState<ElectionDetails[]>([]);
  const [isFetchElections, setIsFetchElections] = useState(false);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    setIsFetchElections(true);
    const getElectionsData = async () => {
      try {
        const { data } = await getElections(USER_ID);
        if (data) {
          setElections(data.data);
          setIsFetchElections(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getElectionsData();
  }, []);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Monitor an election</h1>
        <MonitorAnElection
          elections={elections}
          isFetchElections={isFetchElections}
        />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default MonitorElection;
