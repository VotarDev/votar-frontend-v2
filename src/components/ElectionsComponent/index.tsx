import React, { useEffect, useState } from "react";
import { getElections } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { ElectionDetails } from "@/utils/types";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

import { MdDelete } from "react-icons/md";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import DeleteDialog from "./DeleteDialog";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";

const ElectionsComponent = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [elections, setElections] = useState<ElectionDetails[]>([]);
  const [isFetchElections, setIsFetchElections] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);
  const cookies = new Cookies();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const getElectionsData = async () => {
    setIsFetchElections(true);
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
  useEffect(() => {
    getElectionsData();
  }, []);

  const handleElectionDetails = (election: string, id: string) => {
    router.push(`/elections/${election}/${id}`);
  };

  return (
    <div>
      <h1 className="text-4xl">Elections </h1>
      <div>
        {isFetchElections ? (
          <div className="mt-10">
            <CircularProgress size={30} style={{ color: "#015CE9" }} />
          </div>
        ) : (
          <div className="pt-5">
            {elections.length === 0 ? (
              <div className=" text-lg font-medium text-gray-500">
                No elections found
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {elections.map((election, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:underline"
                      onClick={() =>
                        handleElectionDetails(
                          election.name_of_election,
                          election.election_id
                        )
                      }
                    >
                      <div className="text-lg font-semibold">
                        {index + 1}. {election.name_of_election}
                      </div>
                    </div>
                    <div>
                      <DeleteDialog
                        selectedAdmin={election.name_of_election}
                        id={election.election_id}
                        admins={elections}
                        setAdmins={setElections}
                        getUpdatedList={() => getElectionsData()}
                        userId={USER_ID}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionsComponent;
