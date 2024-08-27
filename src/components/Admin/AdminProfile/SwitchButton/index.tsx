import React, { useState, useEffect } from "react";
import { adminPublishElection, getElectionById } from "@/utils/api";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

const SwitchButton = ({ id, row, userMail }: any) => {
  const [isFetchElectionDetails, setIsFetchElectionDetails] = useState(false);
  const [electionStatus, setElectionStatus] = useState<any>(null);

  const getVotarProPower = async () => {
    setIsFetchElectionDetails(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) setAuthToken(token);
    try {
      const { data } = await getElectionById({
        election_id: row.election_id,
      });
      if (data) {
        setElectionStatus(data.data.published);

        setIsFetchElectionDetails(false);
      }
    } catch (e: any) {
      console.log(e);
      setIsFetchElectionDetails(false);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) {
      setAuthToken(token);
    }
    try {
      console.log(row);
      const status = event.target.checked ? "true" : "false";
      const bodyData = { election_id: row.election_id, state: status };
      const { data } = await adminPublishElection(bodyData);
      console.log(data);
      toast.success("Election status updated successfully");
      getVotarProPower();
    } catch (error) {
      console.log(error);
      toast.error("An error occured");
    }
  };
  useEffect(() => {
    getVotarProPower();
  }, [electionStatus]);

  return (
    <div>
      {isFetchElectionDetails ? (
        <CircularProgress size={20} style={{ color: "#015CE9" }} />
      ) : (
        <label className="toggle">
          <input
            className="toggle-checkbox"
            type="checkbox"
            onChange={handleChange}
            checked={electionStatus ? electionStatus : false}
          />
          <div className="toggle-switch"></div>
        </label>
      )}
    </div>
  );
};

export default SwitchButton;
