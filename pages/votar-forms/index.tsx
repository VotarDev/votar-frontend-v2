import React, { useEffect, useState } from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import VotarFormsComponent from "@/src/components/VotarFormsComponent";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { getElections } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { ElectionDetails } from "@/utils/types";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";

const VotarForms = () => {
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
    const token = cookies.get("user-token");
    if (token) {
      setAuthToken(token);
    }
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
        setIsFetchElections(false);
      }
    };
    getElectionsData();
  }, []);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Votar Forms</h1>

        <VotarFormsComponent
          elections={elections}
          isFetchElections={isFetchElections}
        />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default VotarForms;
